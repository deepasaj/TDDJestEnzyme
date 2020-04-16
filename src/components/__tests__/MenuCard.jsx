import React from 'react';
import { shallow } from 'enzyme';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import AssignmentIcon from '@material-ui/icons/Assignment';
import MenuCard from 'components/MenuCard';

const mockOnClick = jest.fn();

describe('Menu Card', () => {
  const sampleTitle = 'Sample Title';
  const sampleButtonText = 'Sample Button Text';
  const sampleIcon = <AssignmentIcon />;

  const menuCard = shallow(<MenuCard
    title={sampleTitle}
    cardIcon={sampleIcon}
    btnText={sampleButtonText}
    onClick={mockOnClick}
  />);

  it('should render the card with given title and icon', () => {
    expect(menuCard.type()).toEqual(Card);
    const cardContent = menuCard.childAt(0);
    expect(cardContent.type()).toEqual(CardContent);
    expect(cardContent.contains(sampleIcon)).toBeTruthy();
    expect(cardContent.find(Typography).text()).toEqual(sampleTitle);
  });

  it('should render the card with given button text', () => {
    expect(menuCard.type()).toEqual(Card);
    const cardActions = menuCard.childAt(1);
    expect(cardActions.type()).toEqual(CardActions);
    expect(cardActions.find(Typography).text()).toEqual(sampleButtonText);
  });

  it('should call onClick on click of card', () => {
    menuCard.simulate('click');
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
