import "../styles/Profile.css"
import "bootstrap/dist/css/bootstrap.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { RiAccountCircleFill } from "react-icons/ri";
import { MdPrivacyTip } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import { IoRibbon } from "react-icons/io5";


const Profile = () => {
    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-header pt-5">
                    <h2 className="fs-2">Profile</h2>
                </div>
                <div className="header-bar"></div>
                <div className="row">
                    <div className="col-6 col-m-6 w-25 pt-3 side-area">
                        <div className="card card-orientation">
                            <div className="card-body">
                                <ul className="pt-1">
                                    <li className="list-element"><RiAccountCircleFill style={{ color: '#0366fc' }} className="icon-style primary" /><button className="btn btn-txt fs-5">Account Setting</button></li>
                                    <li className="list-element"><MdPrivacyTip style={{ color: '#4c4a52' }} className="icon-style" /><button className="btn btn-txt fs-5">Security & Privacy</button></li>
                                    <li className="list-element"><IoSettingsSharp className="icon-style" /><button className="btn btn-txt fs-5">Preferences</button></li>
                                    <li className="list-element"><IoRibbon style={{ color: '#d61c57' }} className="icon-style" /><button className="btn btn-txt fs-5">Favorite Bars</button></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-m-6 w-75 pt-3 side-content">
                        <div className="card card-orientation">
                            <div className="card-body">
                                Side bar Content
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile