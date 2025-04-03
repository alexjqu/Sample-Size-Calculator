import React, { useState } from 'react';
import './App.css';
import { jStat } from 'jstat';

function SampleSizeCalculator() {
  const [numGroups, setNumGroups] = useState('One');
  const [testObjective, setTestObjective] = useState('Equality');
  const [numSides, setNumSides] = useState('1-Sided');
  const [meanHistCtrl, setMeanHistCtrl] = useState('0.2');
  const [meanTreatment, setMeanTreatment] = useState('0.5');
  const [stdev, setStdev] = useState('1');
  const [type1, setType1] = useState('0.05');
  const [power, setPower] = useState('0.8');
  const [sampleSize, setSampleSize] = useState(null);
  const [error, setError] = useState(null);
  const [allocationRatio, setAllocationRatio] = useState('1');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (/^\d*\.?\d*$/.test(value) && (value.match(/\./g) || []).length <= 1) {
      if (name === 'meanHistCtrl') {
        setMeanHistCtrl(value);
      } else if (name === 'meanTreatment') {
        setMeanTreatment(value);
      } else if (name === 'stdev') {
        setStdev(value);
      } else if (name === 'Type 1 Error') {
        setType1(value);
      } else if (name === 'Power') {
        setPower(value);
      } else if (name === 'allocationRatio') {
        setAllocationRatio(value);
      }
    }
  };

  const handleGroupSelection = (group) => {
    setNumGroups(group);
  };

  const sampleSizeCalc = async () => {
    try {
      const response = await fetch("http://127.0.0.1:29268/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mu1: parseFloat(meanTreatment),
          mu2: parseFloat(meanHistCtrl),
          sd1: parseFloat(stdev),
          sd2: parseFloat(stdev),
          kappa: parseFloat(allocationRatio),
          power: parseFloat(power),
          alpha: parseFloat(type1),
          method: "t" // or "z" for z-test
        }),
      });
  
      const data = await response.json();
      if (data.n1 !== undefined) {
        setSampleSize(`Group 1: ${Math.ceil(data.n1)}, Group 2: ${Math.ceil(data.n2)}`);
        setError(null);
      } else {
        setError("Error calculating sample size.");
        setSampleSize(null);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to backend.");
      setSampleSize(null);
    }
  };
  
   /* const sampleSizeCalc = () => {
    if (numGroups === "One") {
      const muC = parseFloat(meanHistCtrl);
      const muT = parseFloat(meanTreatment);
      const s = parseFloat(stdev);
      const alpha = parseFloat(type1);
      const beta = 1 - parseFloat(power);
      const epsilon = muT - muC;

      let n = 1;
      let solved = false;
      const maxIterations = 10000; // Maximum number of iterations to prevent infinite loops
      let iterations = 0;

      while (!solved && iterations < maxIterations) {
        let theta;
        let criticalValue;
        if (testObjective === 'Equality') {
          if (numSides === '1-Sided') {
            criticalValue = jStat.studentt.inv(1 - alpha, n - 1);
            theta = (Math.sqrt(n) * Math.abs(epsilon)) / s;
          } else {
            criticalValue = jStat.studentt.inv(1 - alpha / 2, n - 1);
            theta = (Math.sqrt(n) * Math.abs(epsilon)) / s;
          }
        } else if (testObjective === 'Equivalence') {
          criticalValue = jStat.studentt.inv(1 - alpha, n - 1);
          theta = (Math.sqrt(n) * (delta - Math.abs(epsilon))) / s;
        } else if (testObjective === 'Noninferiority') {
          const delta = 0.1; // Example noninferiority margin, you can make this configurable
          criticalValue = jStat.studentt.inv(1 - alpha, n - 1);
          theta = (Math.sqrt(n) * (epsilon + delta)) / s;
        } else if (testObjective === 'Superiority') {
          const delta = 0.1; // Example superiority margin, you can make this configurable
          criticalValue = jStat.studentt.inv(1 - alpha, n - 1);
          theta = (Math.sqrt(n) * (epsilon - delta)) / s;
        }

        const powerCalc = 1 - jStat.normal.cdf(criticalValue, theta, s);

        if (powerCalc >= 1 - beta) {
          solved = true;
          setSampleSize(n);
          setError(null); // Clear any previous errors
        } else {
          n++;
        }
        iterations++;
      }

      if (!solved) {
        setError('Sample size calculation failed to converge. Please check your inputs.');
        setSampleSize(null);
      }
    } else if (numGroups === 'Two (independent)') {
      const epsilon = parseFloat(meanHistCtrl-meanTreatment);
      const s = parseFloat(stdev);
      const alpha = parseFloat(type1);
      const beta = 1 - parseFloat(power);
      const k = parseFloat(allocationRatio);

      let nC = 1;
      let solved = false;
      const maxIterations = 10000; // Maximum number of iterations to prevent infinite loops
      let iterations = 0;

      while (!solved && iterations < maxIterations) {
        let theta;
        let criticalValue;
        if (testObjective === 'Equality') {
          if (numSides === '1-Sided') {
            criticalValue = jStat.studentt.inv(1 - alpha, (1 + k) * nC - 2);
            theta = (Math.sqrt(nC) * Math.abs(epsilon)) / (s * Math.sqrt(1 + 1 / k));
          } else {
            criticalValue = jStat.studentt.inv(1 - alpha / 2, (1 + k) * nC - 2);
            theta = (Math.sqrt(nC) * Math.abs(epsilon)) / (s * Math.sqrt(1 + 1 / k));
          }
        }

        // Something wrong here
        const powerCalc = 1- jStat.normal.cdf(criticalValue, theta, s);

        if (powerCalc >= 1 - beta) {
          solved = true;
          setSampleSize(nC);
          setError(null); // Clear any previous errors
        } else {
          nC++;
        }
        iterations++;
      }

      if (!solved) {
        setError('Sample size calculation failed to converge. Please check your inputs.');
        setSampleSize(null);
      }
    }
  }; */

  // Add sample size from z score
  const sampelSizeZ = () => {

  }

  const renderInputs = () => {
    if (numGroups === 'Two (independent)') {
      return (
        <>
          <label>
            Test Objective:
            <select value={testObjective} onChange={(e) => setTestObjective(e.target.value)}>
              <option value={'Equality'}>Equality</option>
              <option value={'Equivalence'}>Equivalence</option>
              <option value={'Noninferiority'}>Noninferiority</option>
              <option value={'Superiority'}>Superiority</option>
            </select>
          </label>
          <label>
            1 or 2 Sided Test?
            <select value={numSides} onChange={(e) => setNumSides(e.target.value)}>
              <option value={'1-Sided'}>1-Sided</option>
              <option value={'2-Sided'}>2-Sided</option>
            </select>
          </label>
          <label>
            Mean for Historical Control
            <input
              type="text"
              name="meanHistCtrl"
              value={meanHistCtrl}
              onChange={handleInputChange}
              placeholder="0.5"
            />
          </label>
          <label>
            Mean for Treatment
            <input
              type="text"
              name="meanTreatment"
              value={meanTreatment}
              onChange={handleInputChange}
              placeholder="0.2"
            />
          </label>
          <label>
            Standard Deviation
            <input
              type="text"
              name="stdev"
              value={stdev}
              onChange={handleInputChange}
              placeholder="1"
            />
          </label>
          <label>
            Subject Allocation Ratio
            <input
              type="text"
              name="allocationRatio"
              value={allocationRatio}
              onChange={handleInputChange}
              placeholder="1"
            />
          </label>
          <label>
            Type 1 Error
            <input
              type="text"
              name="Type 1 Error"
              value={type1}
              onChange={handleInputChange}
              placeholder="0.05"
            />
          </label>
          <label>
            Power
            <input
              type="text"
              name="Power"
              value={power}
              onChange={handleInputChange}
              placeholder="0.8"
            />
          </label>
        </>
      );
    } else if (numGroups === 'One') {
      return (
        <>
          <label>
            Test Objective:
            <select value={testObjective} onChange={(e) => setTestObjective(e.target.value)}>
              <option value={'Equality'}>Equality</option>
              <option value={'Equivalence'}>Equivalence</option>
              <option value={'Noninferiority'}>Noninferiority</option>
              <option value={'Superiority'}>Superiority</option>
              <option value={'Correlation'}>Correlation</option>
            </select>
          </label>
          <label>
            1 or 2 Sided Test?
            <select value={numSides} onChange={(e) => setNumSides(e.target.value)}>
              <option value={'1-Sided'}>1-Sided</option>
              <option value={'2-Sided'}>2-Sided</option>
            </select>
          </label>
          <label>
            Mean for Historical Control
            <input
              type="text"
              name="meanHistCtrl"
              value={meanHistCtrl}
              onChange={handleInputChange}
              placeholder="0.2"
            />
          </label>
          <label>
            Mean for Treatment
            <input
              type="text"
              name="meanTreatment"
              value={meanTreatment}
              onChange={handleInputChange}
              placeholder="0.5"
            />
          </label>
          <label>
            Standard Deviation
            <input
              type="text"
              name="stdev"
              value={stdev}
              onChange={handleInputChange}
              placeholder="1"
            />
          </label>
          <label>
            Type 1 Error
            <input
              type="text"
              name="Type 1 Error"
              value={type1}
              onChange={handleInputChange}
              placeholder="0.05"
            />
          </label>
          <label>
            Power
            <input
              type="text"
              name="Power"
              value={power}
              onChange={handleInputChange}
              placeholder="0.8"
            />
          </label>
        </>
      );
    }
  };

  return (
    <div className="App">
      <h1>Sample Size Calculator - Continuous Endpoint</h1>
      <div className="calculator">
        <label>
          Number of Groups:
          <div className="group-buttons">
            <button
              className={numGroups === 'One' ? 'active' : ''}
              onClick={() => handleGroupSelection('One')}
            >
              One
            </button>
            <button
              className={numGroups === 'Two (paired)' ? 'active' : ''}
              onClick={() => handleGroupSelection('Two (paired)')}
            >
              Two (paired)
            </button>
            <button
              className={numGroups === 'Two (independent)' ? 'active' : ''}
              onClick={() => handleGroupSelection('Two (independent)')}
            >
              Two (independent)
            </button>
            <button
              className={numGroups === '>2' ? 'active' : ''}
              onClick={() => handleGroupSelection('>2')}
            >
              &gt;2
            </button>
          </div>
        </label>
        {renderInputs()}
        <button onClick={sampleSizeCalc}>Calculate Sample Size</button>
        {sampleSize && <p>Required Sample Size: {sampleSize}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
}

export default SampleSizeCalculator;

// Note: Try using R not jstat
// Pg 167, clinical trial design by guosheng yin