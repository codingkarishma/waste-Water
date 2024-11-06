let screen1 = document.querySelector("#screen1");
let screen2 = document.querySelector("#screen2");
let button = document.querySelector("#btn");
let bodCalcScreen=document.querySelector("#bodCalcScreen");
let organicsCalcScreen=document.querySelector("#organicsCalcScreen");
let codCalcScreen=document.querySelector("#codCalcScreen");
let doCalcScreen=document.querySelector("#doCalcScreen");
let paramCalcScreen=document.querySelector("#paramCalcScreen");
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
console.log(document.querySelector("#calculateDO"))
document.getElementById('doOption').addEventListener('click', () => {
  screen1.style.display = "none";
  screen2.style.display = "none";
  doCalcScreen.style.display = "flex";

  document.getElementById('calculateDO').addEventListener('click', function () {
    const sampleVolume = parseFloat(document.getElementById('sampleVolume').value);
    const titrantVolume = parseFloat(document.getElementById('titrantVolume').value);
    const titrantNormality = parseFloat(document.getElementById('titrantNormality').value);

    if (isNaN(sampleVolume) || isNaN(titrantVolume) || isNaN(titrantNormality)) {
      alert("Please fill in all fields with valid numbers.");
      return;
    }
   console.log(sampleVolume);
   console.log(titrantNormality);
   console.log(titrantVolume);
    const doConcentration = (titrantVolume * titrantNormality * 8000) / sampleVolume; // DO in mg/L

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
    let result = "Unfit"; // Default to unfit if conditions don't match
    
    // Define optimum ranges
    const isPhValid = ph >= 6.5 && ph <= 8.5;
    const isTempValid = temperature >= 10 && temperature <= 20;
    const isAlkalinityValid = alkalinity >= 20 && alkalinity <= 200;
    const isTdsValid = tds >= 300 && tds <= 500;

    // Check if all parameters are within the optimal range
    if (isPhValid && isTempValid && isAlkalinityValid && isTdsValid) {
      result = "Fit"; // If all parameters are valid
    } 
    // Check if any parameters are outside the range but still within acceptable limits
    else if (
      (ph < 6.5 || ph > 8.5) ||
      (temperature < 10 || temperature > 20) ||
      (alkalinity < 20 || alkalinity > 200) ||
      (tds < 300 || tds > 700)
    ) {
      result = "Moderate"; // If some parameters are within limits
    }

    // Display the result
    document.getElementById('paramResult').textContent = `Water quality: ${result}`;
  })
  document.getElementById('paramReturnBtn').addEventListener("click", () => {
    paramCalcScreen.style.display = "none";
    screen2.style.display = "flex";
  });
})