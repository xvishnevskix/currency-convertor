import React from 'react';
import './index.scss';
import Block from "./Block";
import {debounce} from "@mui/material";

function App() {
    const ratesRef = React.useRef({})
    const [fromCurrency, setFromCurrency] = React.useState('RUB')
    const [toCurrency, setToCurrency] = React.useState('USD')
    const [fromPrice, setFromPrice] = React.useState('')
    const [toPrice, setToPrice] = React.useState('')


    React.useEffect(() => {
        fetch("https://api.exchangerate.host/latest")
            .then(response => response.json())
            .then(json => {
                ratesRef.current = json.rates

            })
            .catch(error => console.log('error', error));
    }, [])

    const onChangeFromPrice = (value) => {
        const price = value / ratesRef.current[fromCurrency]
        const result = price * ratesRef.current[toCurrency]
        fromInputUpdate(result)
        setFromPrice(value)
    }

    const onChangeToPrice = (value) => {
        const result = (ratesRef.current[fromCurrency] / ratesRef.current[toCurrency]) * value
        toInputUpdate(result)
        setToPrice(value)
    }

    const fromInputUpdate = React.useCallback(debounce((result) => {
        setToPrice(result)
    },300))

    const toInputUpdate = React.useCallback(debounce((result) => {
        setFromPrice(result)
    },300))
    React.useEffect(() => {
        onChangeToPrice(toPrice)
    }, [toCurrency])
    React.useEffect(() => {
        onChangeFromPrice(fromPrice)
    }, [fromCurrency])



  return (
    <div className="App">
      <Block
          value={fromPrice}
             currency={fromCurrency}
             onChangeCurrency={setFromCurrency}
             onChangeValue={onChangeFromPrice}/>
      <Block value={toPrice}
             currency={toCurrency}
             onChangeCurrency={setToCurrency}
             onChangeValue={onChangeToPrice}/>
    </div>
  );
}

export default App;
