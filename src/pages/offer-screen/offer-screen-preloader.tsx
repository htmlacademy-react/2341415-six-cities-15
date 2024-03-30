import { useParams } from 'react-router-dom';

import { IS_LOADING, NOT_FOUND } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks/app-dispatch';
import { fetchCommentsAction, fetchOffersByIdAction, fetchOffersNearbyAction } from '../../store/api-actions';
import NotFoundPage from '../error-screen/error-404-screen';
import LoadingScreen from '../loading-screen/loading-screen';
import OfferScreen from './offer-screen';

function OfferScreenPreloader(): JSX.Element {
  const dispatch = useAppDispatch();
  const { id } = useParams();

  const selectedOffer = useAppSelector((state) => state.selectedOfferCard);
  const neighbours = useAppSelector((state) => state.neighbours);
  const comments = useAppSelector((state) => state.comments);

  function isOtherOfferLoaded(): boolean {
    return typeof selectedOffer === 'object' && selectedOffer?.id !== id;
  }

  if (id === undefined) {
    return <NotFoundPage />;
  }

  if (selectedOffer === null || isOtherOfferLoaded()) {
    dispatch(fetchOffersByIdAction(id));
    dispatch(fetchOffersNearbyAction(id));
    dispatch(fetchCommentsAction(id));
  }

  if(selectedOffer === null || selectedOffer === IS_LOADING) {
    return <LoadingScreen />;
  }

  if(selectedOffer === NOT_FOUND){
    return <NotFoundPage />;
  }

  return <OfferScreen selectedOffer={selectedOffer} neighbours={neighbours} comments={comments}/>;
}

export default OfferScreenPreloader;
