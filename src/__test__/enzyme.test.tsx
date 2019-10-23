import * as React from 'react';
import {configure, shallow} from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import Assets from '../views/components/Assets';
import Form from '../views/components/Form';
import Visualization from '../views/components/Visualizations';
import LiquidGauge from '../views/components/visuals/LiquidGauges';
import { JSXElement } from '@babel/types';

import App from '../views/App';

configure({ adapter: new Adapter() });

describe('<App />', () => {
  let wrapper: any;
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


