import { CityName } from '../../types';

type Props = {
  cityName: CityName;
  onClick: (cityName: CityName) => void;
  selectedCity: string;
}

function Tabs({ cityName, onClick, selectedCity }: Props): JSX.Element {

  const markedTab = `locations__item-link tabs__item${selectedCity === cityName ? ' tabs__item--active' : ''}`;
  return (
    <li
      onClick={() => onClick(cityName)}
      className="locations__item"
    >
      <a className={markedTab} href="#">
        <span>{cityName}</span>
      </a>
    </li>
  );
}

export default Tabs;
