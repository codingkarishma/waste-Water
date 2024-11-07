let screen1 = document.querySelector("#screen1");
let screen2 = document.querySelector("#screen2");
let button = document.querySelector("#btn");
let bodCalcScreen=document.querySelector("#bodCalcScreen");
let organicsCalcScreen=document.querySelector("#organicsCalcScreen");
let codCalcScreen=document.querySelector("#codCalcScreen");
let doCalcScreen=document.querySelector("#doCalcScreen");
let paramCalcScreen=document.querySelector("#paramCalcScreen");
let rbcCalcScreen = document.querySelector("#rbcCalcScreen");
rbcCalcScreen.style.display = "none";
let tricklingCalcScreen=document.querySelector("#tricklingCalcScreen");
tricklingCalcScreen.style.display="none";
screen2.style.display = "none";
bodCalcScreen.style.display = "none";
organicsCalcScreen.style.display = "none";
codCalcScreen.style.display="none";
doCalcScreen.style.display="none";
paramCalcScreen.style.display="none";
button.addEventListener("click", () => {
  screen1.style.display = "none";
  screen2.style.display = "flex";
});


document.getElementById('rbcOption').addEventListener('click', () => {
  screen1.style.display = "none";
  screen2.style.display = "none";
  rbcCalcScreen.style.display = "flex";

  document.getElementById('rbcButton').addEventListener('click',function(event){
    const data = {
      SBOD: document.getElementById('SBOD').value,
      flowrate: document.getElementById('flowrate').value,
      primaryEffluent: document.getElementById('primaryEffluent').value,
      secondEffluent: document.getElementById('secondEffluent').value,
      numTrains: document.getElementById('numTrains').value,
      numStages: document.getElementById('numStages').value,
      BODprim: document.getElementById('BODprim').value
  
  };
  // console.log(data);
  let sbodLoading = data.primaryEffluent*data.flowrate;
  let diskArea = sbodLoading/data.SBOD;
  let shaftArea = 9300;
  let numShaftsDec = diskArea/shaftArea;
  let numShaftsFull = Math.ceil(numShaftsDec);
  let Q = data.flowrate/data.numTrains;
  console.log(numShaftsDec);
  console.log("Taking: "+ numShaftsFull);
  
  var S0 = data.primaryEffluent;
  var sList = [];
  sList.push(S0);
  while(S0>data.secondEffluent){
    S0 = (-1 + Math.sqrt(1+0.03896*(shaftArea/Q)*S0))/(0.01948 * (shaftArea/Q));
    sList.push(S0);
  }
  console.log(sList);
  var stageNeeded = sList.length - 1;
  console.log(stageNeeded);
  var firstStageOrgLoading = data.flowrate * data.primaryEffluent;
  firstStageOrgLoading  = firstStageOrgLoading/(shaftArea * stageNeeded);

  var ovrOrganicLoading = data.flowrate * data.BODprim;
  ovrOrganicLoading = ovrOrganicLoading/(stageNeeded * numShaftsFull *shaftArea);

  var HLR = data.flowrate/(stageNeeded * numShaftsFull * shaftArea);

  document.getElementById('rbcResult').innerHTML =`
    <div>
      <h3> Results </h3>
      <label for="numShaft">num Shaft: ${numShaftsDec} -> ${numShaftsFull}</label><br>
      <label for="num Stages">num stages: ${stageNeeded}</label><br>
      <label for="firstOrgLoading"> First Stage organic loading: ${firstStageOrgLoading} </label><br>
      <label for="ovrOrgLoading"> overall organic loading: ${ovrOrganicLoading} </label> <br>
      <label for="hydraulicLoading"> overall organic loading: ${HLR}</label><br> 
      <label for="iterations">
        Iterative values<br>
        ${sList.map(ele=>ele+" ")};
      </label>
      </div>
  `
  })
  document.getElementById('rbcReturnBtn').addEventListener('click', () => {
    rbcCalcScreen.style.display = "none";
    screen2.style.display = "flex";
  });
});


//BOD CALCULATIONS
document.getElementById('bodOption').addEventListener('click', () => {
  screen1.style.display = "none";
  screen2.style.display = "none";
  bodCalcScreen.style.display = "flex";

  document.getElementById('generateBODFields').addEventListener('click', function () {
    const numSamples = parseInt(document.getElementById('numSamples').value);
    const bodSampleFields = document.getElementById('bodSampleFields');
    bodSampleFields.innerHTML = '';

    for (let i = 0; i < numSamples; i++) {
      bodSampleFields.innerHTML += `
        <div>
          <h3>Sample ${i + 1}</h3>
          <label for="sampleBOD1_${i}">DO1:</label>
          <input type="number" id="sampleBOD1_${i}" required>
          <label for="sampleBOD2_${i}">DO2:</label>
          <input type="number" id="sampleBOD2_${i}" required>
        </div>
      `;
    }

    document.getElementById('bodForm').style.display = 'block';
  });

  document.getElementById('bodForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const numSamples = parseInt(document.getElementById('numSamples').value);
    const bodVolume = parseFloat(document.getElementById('bodVolume').value);
    const bodDilution = parseFloat(document.getElementById('bodDilution').value);

    let totalBOD = 0;
    let validSamples = 0;

    for (let i = 0; i < numSamples; i++) {
      const do1 = parseFloat(document.getElementById(`sampleBOD1_${i}`).value);
      const do2 = parseFloat(document.getElementById(`sampleBOD2_${i}`).value);

      const depletion = do1 - do2;
      if (do2 >= 1 && depletion >= 2) {
        const bod = (depletion/bodVolume)*bodDilution;
        totalBOD += bod;
        validSamples++;
      } else {
        alert(`Sample ${i + 1} is invalid: residual DO < 1 mg/L or depletion < 2 mg/L.`);
      }
    }

    if (validSamples > 0) {
      const averageBOD = totalBOD / validSamples;
      document.getElementById('bodResult').innerHTML = `Average BOD: ${averageBOD.toFixed(2)} mg/L`;
    } else {
      document.getElementById('bodResult').innerHTML = `No valid samples available for BOD calculation.`;
    }
  });

  document.getElementById('bodReturnBtn').addEventListener('click', () => {
    bodCalcScreen.style.display = "none";
    screen2.style.display = "flex";
  });
});

// Organics Calculations
document.getElementById('organicsOption').addEventListener('click', () => {
  screen1.style.display = "none";
  screen2.style.display = "none";
  organicsCalcScreen.style.display = "flex";

  document.getElementById('calculateOrganics').addEventListener('click', function () {
      // Get input values
      const initialWeight = parseFloat(document.getElementById('initialWeight').value); // in grams
      const weightBeforeDrying = parseFloat(document.getElementById('weightBeforeDrying').value); // in grams
      const weightAfterDrying = parseFloat(document.getElementById('weightAfterDrying').value); // in grams
      const weightAfterIgnition = parseFloat(document.getElementById('weightAfterIgnition').value); // in grams
      const sampleVolume = parseFloat(document.getElementById('sampleVolume').value); // in mL

      // Validate input values
      if (isNaN(sampleVolume) || sampleVolume <= 0 ||
          isNaN(initialWeight) || isNaN(weightBeforeDrying) ||
          isNaN(weightAfterDrying) || isNaN(weightAfterIgnition)) {
          alert("Please enter valid values for all fields.");
          return;
      }

      // Convert weights from grams to milligrams for mg/L results
      const weightOfSample = (weightBeforeDrying - initialWeight) * 1000; // in mg
      const weightAfterDryingOnly = (weightAfterDrying - initialWeight) * 1000; // in mg
      const weightAfterIgnitionOnly = (weightAfterIgnition - initialWeight) * 1000; // in mg

      // Calculate Total Solids (TS), Total Suspended Solids (TSS), Total Dissolved Solids (TDS),
      // Total Volatile Solids (TVS), and Total Fixed Solids (TFS) in mg/L
      const TS = weightOfSample * (1000 / sampleVolume); // Total Solids in mg/L
      const TSS = weightAfterDryingOnly * (1000 / sampleVolume); // Total Suspended Solids in mg/L
      const TDS = TSS ? (TS - TSS) * (1000 / sampleVolume) : 0; // Total Dissolved Solids in mg/L
      const TVS = weightAfterDryingOnly - weightAfterIgnitionOnly; // Volatile Solids in mg
      const TFS = weightAfterIgnitionOnly; // Fixed Solids in mg
      const TVS_L = TVS * (1000 / sampleVolume); // Total Volatile Solids in mg/L
      const TFS_L = TFS * (1000 / sampleVolume); // Total Fixed Solids in mg/L

      // Display results in mg/L
      document.getElementById('organicsResult').innerHTML = `
          <h3>Results:</h3>
          <p>Total Solids (TS): ${TS.toFixed(2)} mg/L</p>
          <p>Total Suspended Solids (TSS): ${TSS.toFixed(2)} mg/L</p>
          <p>Total Dissolved Solids (TDS): ${TDS.toFixed(2)} mg/L</p>
          <p>Total Volatile Solids (TVS): ${TVS_L.toFixed(2)} mg/L</p>
          <p>Total Fixed Solids (TFS): ${TFS_L.toFixed(2)} mg/L</p>
      `;
  });

  // Return button for Organics calculation screen
  document.getElementById('organicsReturnBtn').addEventListener('click', () => {
      organicsCalcScreen.style.display = "none";
      screen2.style.display = "flex"; // Return to main menu
  });
});


// COD Calculations
document.getElementById('codOption').addEventListener('click', () => {
  screen1.style.display = "none";
  screen2.style.display = "none";
  codCalcScreen.style.display = "flex"; // Show COD calculation screen
console.log(document.querySelector("#calculateCOD"));

  document.getElementById('calculateCOD').addEventListener('click', function () {
    // Get input values
    const volume = parseFloat(document.getElementById('volume').value);
    const normality = parseFloat(document.getElementById('normality').value);
    const a = parseFloat(document.getElementById('a').value);
    const b = parseFloat(document.getElementById('b').value);

    // Validate inputs
    if (isNaN(volume) || isNaN(normality) || isNaN(a) || isNaN(b) || volume <= 0) {
      alert("Please enter valid numbers for all fields.");
      return;
    }

    // Calculate COD using the provided formula
    const COD = 8000 * (a - b) * normality / volume;

    // Display result
    document.getElementById('codResult').innerHTML = `<p>COD: ${COD.toFixed(2)} mg/L</p>`;
  });

  // Return button for COD calculation screen
  document.getElementById('codReturnBtn').addEventListener('click', () => {
    codCalcScreen.style.display = "none";
    screen2.style.display = "flex"; // Return to main menu
  });
});

// DO Calculations
document.getElementById('doOption').addEventListener('click', () => {
  screen1.style.display = "none";
  screen2.style.display = "none";
  doCalcScreen.style.display = "flex";
  let volumeOfSample,volumeOfTitrant,normality;
  let doSampleVolume=document.querySelector("#doSampleVolume");
  console.log(doSampleVolume);
  doSampleVolume.addEventListener("change",(e)=>{
     volumeOfSample=Number(e.target.value);
    console.log(volumeOfSample);
  })
  let titrantVolume=document.querySelector("#titrantVolume");
  titrantVolume.addEventListener("change",(e)=>{
     volumeOfTitrant=Number(e.target.value);
    console.log(volumeOfTitrant);
  })
  let titrantNormality=document.querySelector("#titrantNormality");
  titrantNormality.addEventListener("change",(e)=>{
    normality=Number(e.target.value);
    console.log(normality);
  })
  document.getElementById('calculateDO').addEventListener('click', function () {
   console.log(volumeOfSample);
   console.log(volumeOfTitrant);
   console.log(normality);
    const doConcentration = (normality * volumeOfTitrant * 8000) / volumeOfSample; // DO in mg/L

    document.getElementById('doResult').innerHTML = `DO: ${doConcentration.toFixed(2)} mg/L`;
  }); 
  document.getElementById('doReturnBtn').addEventListener('click', () => {
    doCalcScreen.style.display = "none";
    screen2.style.display = "flex";
  });
});

//Param Checks
document.querySelector("#paramOption").addEventListener("click",()=>{
  screen1.style.display = "none";
  screen2.style.display = "none";
  paramCalcScreen.style.display = "flex";

  document.querySelector("#checkParams").addEventListener("click",()=>{
    const ph = parseFloat(document.getElementById('ph').value);
    const temperature = parseFloat(document.getElementById('temperature').value);
    const alkalinity = parseFloat(document.getElementById('alkalinity').value);
    const tds = parseFloat(document.getElementById('tds').value);
    //let result = "Unfit"; // Default to unfit if conditions don't match
    
    if(isNaN(ph) || isNaN(temperature) || isNaN(alkalinity) || isNaN(tds)){
      alert("Please enter valid numbers");
    }
    // Define optimum ranges
    const isPhValid = ph >= 6.5 && ph <= 8.5;
    const isTempValid = temperature >= 10 && temperature <= 20;
    const isAlkalinityValid = alkalinity >= 20 && alkalinity <= 200;
    const isTdsValid = tds >= 300 && tds <= 600;

    // Check if all parameters are within the optimal range
    if (isPhValid && isTempValid && isAlkalinityValid && isTdsValid) {
      result = "Fit"; // If all parameters are valid
    } 
    // Check if any parameters are outside the range but still within acceptable limits
    else if (
      (ph < 6.5 || ph > 8.5) ||
      (temperature < 10 || temperature > 20) ||
      (alkalinity < 20 || alkalinity > 200) ||
      (tds > 600 || tds < 900)
    ) {
      result = "Moderate"; // If some parameters are within limits
    }else{
      result="Unfit";
    }

    // Display the result
    document.getElementById('paramResult').textContent = `Water quality: ${result}`;
   
  })
  document.getElementById('paramReturnBtn').addEventListener("click", () => {
    paramCalcScreen.style.display = "none";
    screen2.style.display = "flex";
  });
})

//trickling

document.querySelector("#tricklingOption").addEventListener("click",()=>{
  screen1.style.display = "none";
  screen2.style.display = "none";
  tricklingCalcScreen.style.display = "flex";

let rate=document.querySelector("#flow");
let bOD=document.querySelector("#bod");
let tKN=document.querySelector("#tkn");
let diaa=document.querySelector("#diameter");
let len=document.querySelector("#length");
let spSurface=document.querySelector("#specificSurfaceArea");

  document.querySelector("#calculateTrickle").addEventListener("click",()=>{

        const flow =parseFloat(document.querySelector('#flow').value);
        const bod = parseFloat(document.getElementById('bod').value);
        const tkn = parseFloat(document.getElementById('tkn').value);
        const diameter = parseFloat(document.getElementById('diameter').value);
        const length = parseFloat(document.getElementById('length').value);
        const specificSurfaceArea = parseFloat(document.getElementById('specificSurfaceArea').value);
console.log(flow,bod,tkn,diameter,length,specificSurfaceArea);
    const area = 3.14 *  (diameter*diameter)/ 4;  // Area of the trickling filter
    const volume = area * length;  // Volume of the trickling filter
  
    // Calculate BOD Loading Rate (kg/m³d)
    const bodLoadingRate = (flow * bod) / volume;
  
    // Calculate TKN Loading (kg/m³d)
    const tknLoading = (flow * tkn) / volume;
    const specificTknLoading = tknLoading / (specificSurfaceArea * volume);
    const resultDiv = document.getElementById('trickleResult');
     
    console.log(bodLoadingRate,tknLoading,specificTknLoading);
      resultDiv.innerHTML = `
      <strong>Results:</strong><br>
      BOD Loading Rate: ${bodLoadingRate.toFixed(4)} kg/m³d<br>
      TKN Loading Rate: ${tknLoading.toFixed(4)} kg/m³d<br>
      Specific TKN Loading: ${specificTknLoading.toFixed(4)} kgTKN/m²d<br>`;
  })
        document.getElementById('trickleReturnBtn').addEventListener("click", () => {
          tricklingCalcScreen.style.display = "none";
          screen2.style.display = "flex";
          rate.value="";
          bOD.value="";
          tKN.value="";
          diaa.value="";
          len.value="";
          spSurface.value="";

        });
 })