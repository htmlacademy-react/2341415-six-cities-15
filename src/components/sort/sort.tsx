import { MouseEvent, useState } from 'react';
import { SortVariants } from '../../const';
import cn from 'classnames';
import { sortingOrderChangeAction } from '../../store/action';
import { useAppDispatch } from '../../hooks/app-dispatch';

type Props = {
  selectedSorting: SortVariants;
}

function Sort({ selectedSorting }: Props): JSX.Element {
  const [isOpened, setIsOpened] = useState(false);
  const dispatch = useAppDispatch();

  function handleSelectedItemClick(evt: MouseEvent) {
    evt.preventDefault();
    setIsOpened(!isOpened);
  }

  function handleMenuClick(evt: MouseEvent<HTMLUListElement>) {
    evt.preventDefault();

    if (evt.target instanceof HTMLLIElement) {
      const newSortingOrder = evt.target.innerText as SortVariants;
      const action = sortingOrderChangeAction(newSortingOrder);
      dispatch(action);
      setIsOpened(false);
    }
  }

  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">Sort by </span>
      <span onClick={handleSelectedItemClick} className="places__sorting-type" tabIndex={0}>
        {selectedSorting}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>
      <ul className={cn('places__options', 'places__options--custom', { 'places__options--opened': isOpened })} onClick={handleMenuClick}>
        {Object.values(SortVariants).map((sortingOrder) => (
          <li key={sortingOrder} className={cn('places__option', { 'places__option--active': selectedSorting === sortingOrder })} >{sortingOrder}</li>
        ))}
      </ul>
    </form>
  );
}

export default Sort;
