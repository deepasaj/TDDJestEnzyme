import React from 'react';
import { shallow } from 'enzyme';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import StatsCard from 'components/StatsCard';

const mockOnClick = jest.fn();

describe('Stats Card', () => {
  it('should render the card with given number and text', () => {
    const sampleText = 'Sample Text';
    const statsCard = shallow(<StatsCard onClick={mockOnClick} text={sampleText} num={10} />);

    expect(statsCard.type()).toEqual(Card);
    const cardContent = statsCard.childAt(0);
    expect(cardContent.type()).toEqual(CardContent);
    expect(cardContent.children()).toHaveLength(2);
    expect(cardContent.childAt(0).type()).toEqual(Typography);
    expect(cardContent.childAt(0).text()).toEqual(10);
    expect(cardContent.childAt(1).type()).toEqual(Typography);
    expect(cardContent.childAt(1).text()).toEqual(sampleText);
  });

  it('should call onClick on click of card', () => {
    const statsCard = shallow(<StatsCard onClick={mockOnClick} text="Sample Text" num={10} />);

    statsCard.simulate('click');
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
