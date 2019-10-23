import {configure, shallow} from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import App from '../../views/App';
import Assets from '../../views/components/Assets';
import Form from '../../views/components/Form';
import Visualization from '../../views/components/Visualizations';
import LiquidGauge from '../../views/components/visuals/LiquidGauges';


configure({ adapter: new Adapter() });