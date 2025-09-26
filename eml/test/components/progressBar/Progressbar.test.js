import React from 'react';
import renderer from 'react-test-renderer';
import CustomProgressBar from '../../../components/exercise/Progressbar';

describe('<CustomProgressBar />', () => {

  it('Displays 50% (5/10)', () => {
    const component = renderer.create(
      <CustomProgressBar progress={[50, 5, 10]} width={100} height={10} />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Displays 25% (2/8)', () => {
    const component = renderer.create(
      <CustomProgressBar progress={[25, 2, 8]} width={100} height={10} />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Displays 0% for no progress (0/10)', () => {
    const component = renderer.create(
      <CustomProgressBar progress={[0, 0, 10]} width={100} height={10} />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Displays 100% for full progress (10/10)', () => {
    const component = renderer.create(
      <CustomProgressBar progress={[100, 10, 10]} width={100} height={10} />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Limits display to 0% for negative progress (-2/10)', () => {
    const component = renderer.create(
      <CustomProgressBar progress={[-50, -2, 10]} width={100} height={10} />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Limits display to 100% for excess progress (15/10)', () => {
    const component = renderer.create(
      <CustomProgressBar progress={[150, 15, 10]} width={100} height={10} />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});