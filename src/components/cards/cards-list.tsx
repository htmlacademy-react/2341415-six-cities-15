import { useState } from 'react';
import type { Offer } from '../../types';
import Card from './card';

type Props = {
  offers: Offer[];
};

export default function CardsList({ offers }: Props): JSX.Element {
  const [, setActiveOfferId] = useState<null | string>(null);

  function createCard(offer: Offer) {
    return (
      <Card
        key={offer.id}
        onMouseEnter={(id) => setActiveOfferId(id)}
        onMouseLeave={() => setActiveOfferId(null)}
        {...offer}
      />
    );
  }

  return (<>{offers.map(createCard)}</>);
}
