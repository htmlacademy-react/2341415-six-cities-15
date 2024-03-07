import { CityName } from '../../types';

type Props = {
  cityName: CityName;
  onClick: (cityName: CityName) => void;
}

function Tabs({ cityName, onClick }: Props): JSX.Element {
  return (
    <li
      onClick={() => onClick(cityName)}
      className="locations__item"
    >
      <a className="locations__item-link tabs__item" href="#">
        <span>{cityName}</span>
      </a>
    </li>
  );
}

export default Tabs;
