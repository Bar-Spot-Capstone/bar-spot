import "../styles/Profile.css"
import "bootstrap/dist/css/bootstrap.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const Profile = () => {
    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-header pt-5">
                    <h2 className="fs-2">Profile</h2>
                </div>
                <div className="header-bar"></div>
                <div className="row">
                    <div className="col-6 w-25 pt-3 side-area">
                        <div className="card card-orientation">
                            <div className="card-body">
                                <ul>
                                    <li>Account Setting</li>
                                    <li>Security & Privacy</li>
                                    <li>Preferences</li>
                                    <li>Favorite Bars</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 w-75 pt-3 side-content">
                        <div className="card card-orientation">
                            <div className="card-body">
                                Side bar Content
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Profile