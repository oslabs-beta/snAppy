import * as React from 'react';
import {configure, shallow, ShallowWrapper} from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as toJson from 'enzyme-to-json';
import Assets from '../views/components/Assets';
import Form from '../views/components/Form';
import Visualization from '../views/components/Visualizations';
import LiquidGauge from '../views/components/visuals/LiquidGauges';

import App from '../views/App';

configure({ adapter: new Adapter() });

describe('<App />', () => {
  let wrapper: ShallowWrapper;
  beforeAll(()=>{
    wrapper = shallow(<App/>);  
  })
  it('renders one <CurrentComponent /> components', () => {
    expect(wrapper.length).toEqual(1);
  });
  it('renders one h1', () => {
     expect(wrapper.find('h1').length).toEqual(1);
   }); 
  it('h1 renders logo in text', () => {
    expect(wrapper.find('h1').text()).toEqual('snAppy');
  });
});

const clickForm = jest.fn();

describe('<Form/>', () => {
  interface Props {
    runFunc: Function;
    entryFunc: Function;
    entry: string;
  }
  let wrapper: ShallowWrapper;
  const runWebpackGetStats = jest.fn();
  const entryFunc = jest.fn();
  const entry = 'mock string';

  const props = {
    runFunc: runWebpackGetStats,
    entryFunc: entryFunc,
    entry: entry
  };
  beforeAll(()=> {
    wrapper=shallow(<Form {...props}/>);
  });
    it('is a div with a form', () => {
      expect(wrapper.find('form').length).toEqual(1);
    });
    it('has an onClick function', () => {
      const fakeEvent = { preventDefault: () => console.log('preventDefault') };
      wrapper
        .find('form')
        .simulate('submit', fakeEvent);
      expect(runWebpackGetStats).toHaveBeenCalled();
    });
    it('has an onChange function', () => {
      const fakeEvent = {
        target: { value: 'the-value' }
      };
      wrapper
        .find('form')
        .find('input').forEach(i => {
          i.simulate('change', fakeEvent);
        });
      expect(entryFunc).toBeCalled();
    });
});


