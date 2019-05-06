import React from "react";
import ReactDOM from "react-dom";
import { sum } from "lodash";

import { Pie } from "./Pie";

import "./styles.css";

const catGeophysical = "Geophysical";
const catWeatherRelated = "Weather related";

const groupAndSum = (data, groupProperty, amountProperty) =>
  data.reduce((acc, curr) => {
    const group = curr[groupProperty];
    if (!acc[group]) acc[group] = 0;
    acc[group] += curr[amountProperty];
    return acc;
  }, {});

const prepareData = data => {
  const simplified = data.map(item => ({
    id: item.hazard_category,
    value: item.new_displacements,
    iso: item.iso
  }));
  const filtered = simplified.filter(item => item.id && item.value);

  const dataGeophysical = filtered
    .filter(item => item.id === catGeophysical)
    .map(v => v.value);
  const dataWeatherRelated = filtered
    .filter(item => item.id === catWeatherRelated)
    .map(v => v.value);
  let sumGeophysical = sum(dataGeophysical);
  let sumWeatherRelated = sum(dataWeatherRelated);

  console.log(sumGeophysical);
  console.log(sumWeatherRelated);

  console.log(dataGeophysical);

  // This is a simpler way of doing the above
  const sums = groupAndSum(simplified, "id", "value");
  const easierSumGeophysical = sums[catGeophysical];
  const easierSumWeatherRelated = sums[catWeatherRelated];

  console.log(easierSumGeophysical);
  console.log(easierSumWeatherRelated);

  return [
    {
      id: "Geophysical",
      value: sumGeophysical
    },
    {
      id: "Weather-related",
      value: sumWeatherRelated
    }
  ];
};

class App extends React.Component {
  state = {
    loading: true
  };
  componentDidMount() {
    fetch(
      "https://api.idmcdb.org/api/disaster_data?year=2017&ci=IDMCWSHSOLO009"
    )
      .then(resp => resp.json())
      .then(({ results }) => this.setState({ data: results, loading: false }));
  }
  render() {
    if (this.state.loading) {
      return <h3>Loading... stay tuned!</h3>;
    }
    return (
      <div className="App">
        <Pie data={prepareData(this.state.data)} />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
