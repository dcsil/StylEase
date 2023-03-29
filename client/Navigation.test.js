import { render } from '@testing-library/react-native';
import { Navigation } from './Navigation';

describe('Navigation', () => { 
  it('renders correctly', () => {
    const { debug, getByText } = render(<Navigation />);
    debug();
    expect(getByText("StylEase by No Brainer Team!!!")).toBeDefined();
  });
});