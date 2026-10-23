import {useNavigate} from 'react-router-dom';
import {useDating} from '../state/useDating';
import {toSelfPerson} from '../selfProfile';
import SwipeProfileCard from '../components/cards/SwipeProfileCard';
export default function MyProfilePage(){const {state}=useDating();const navigate=useNavigate();return <><SwipeProfileCard current={toSelfPerson(state.profile)} own goal={state.profile.goal}/><button className="d-primary d-wide" onClick={()=>navigate('/profile/edit')}>Редактировать профиль</button></>}
