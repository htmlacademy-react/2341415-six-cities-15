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
      >
        <div className="near-places__image-wrapper place-card__image-wrapper">
          <img className="place-card__image" src={offer.previewImage} width="260" height="200" alt="Place image" />
        </div>
      </ Card>
    );
  }

  return (<>{offers.map(createCard)}</>);
}
