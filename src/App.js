import React, { useState } from 'react';
import './App.css';

function SampleSizeCalculator() {
  const [numGroups, setNumGroups] = useState('One');
  const [testObjective, setTestObjective] = useState('Equality');
  const [numSides, setNumSides] = useState('1-Sided');
  const [meanHistCtrl, setMeanHistCtrl] = useState('0.2');
  const [meanTreatment, setMeanTreatment] = useState('0.5');
  const [stdev, setStdev] = useState('1')
  const [type1, setType1] = useState('0.05')
  const [power, setPower] = useState('0.8')

  // Single handler for both inputs
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (/^\d*\.?\d*$/.test(value) && (value.match(/\./g) || []).length <= 1) {
      if (name === 'meanHistCtrl') {
        setMeanHistCtrl(value);
      } else if (name === 'meanTreatment') {
        setMeanTreatment(value);
      } else if (name === 'stdev') {
        setStdev(value);
      } else if (name === 'Type 1 Error') {numGroups
        setType1(value);
      } else if (name === 'Power') {
        setPower(value);
      }
    }

    
  };

  return (
    <div className="App">
      <h1>Sample Size Calculator - Continuous Endpoint</h1>
      <div className="calculator">
        <label>
          Number of Groups:
          <select value={numGroups} onChange={(e) => setNumGroups(e.target.value)}>
            <option value={'One'}>One</option>
            <option value={'Two (paired)'}>Two (paired)</option>
            <option value={'Two (independent)'}>Two (independent)</option>
            <option value={'>2'}>&gt;2</option>
          </select>
        </label>
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
            placeholder="0.5"
          />
        </label>
        <label>
          Type 1 Error
          <input
            type="text"
            name="Type 1 Error"
            value={type1}
            onChange={handleInputChange}
            placeholder="0.5"
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
        <button>Calculate Sample Size</button>
      </div>
    </div>
  );
}

export default SampleSizeCalculator;