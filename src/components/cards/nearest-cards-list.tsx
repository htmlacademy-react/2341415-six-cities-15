import type { Offer } from '../../types';
import Card from './card';

type Props = {
  offers: Offer[];
};

export default function NearestCardsList({ offers }: Props): JSX.Element {
  function createCard(offer: Offer) {
    return (
      <Card
        key={offer.id}
        {...offer}
        className='near-places__card'
        imgWrapperClassName='near-places__image-wrapper place-card__image-wrapper'
      >
      </ Card>
    );
  }

  return (<>{offers.map(createCard)}</>);
}
