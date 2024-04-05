import type { Offer } from '../../types';
import Card from './card';

type Props = {
  offers: Offer[];
  onCardMouseEnter?: (id: string) => void;
  onCardMouseLeave?: () => void;
};

export default function CardsList({ offers, onCardMouseEnter, onCardMouseLeave }: Props): JSX.Element {
  function createCard(offer: Offer) {
    return (
      <Card
        key={offer.id}
        className='cities__card'
        onMouseEnter={onCardMouseEnter}
        onMouseLeave={onCardMouseLeave}
        imgWrapperClassName='cities__image-wrapper place-card__image-wrapper'
        {...offer}
      />
    );
  }

  return (<>{offers.map(createCard)}</>);
}
