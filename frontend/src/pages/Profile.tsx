import { RiAccountCircleFill } from "react-icons/ri";
import { MdPrivacyTip } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import { IoRibbon } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Rootstate } from "../state/store";
import { useState } from "react";
import { useEffect } from "react";
import TimerInput from "../components/TimerInput";
import ConfirmationPopup from "../components/ConfirmationPopup";
import unavailableImage from "../assets/image_unavailable_photo.png"
import "../styles/Profile.css"
import "bootstrap/dist/css/bootstrap.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { deleteFav, getFav, clearFav } from "../types/fetchCall";

const Profile = () => {
    const username: string = useSelector((state: Rootstate) => state.user.username);
    const email: string = useSelector((state: Rootstate) => state.user.email);
    const userId: number = useSelector((state: Rootstate) => state.user.userId);

    const [renderOption, setOption]: any = useState('accountSetting');
    const [trackLocation, setLocationOption] = useState(true);
    const [trackBars, setTrackedBars] = useState(true);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [favoriteBars, setFavoriteBars] = useState<{ favorites: any[] }>({ favorites: [] });

    const fetchFavorites = async () => {
        const authToken = localStorage.getItem('authToken');

        try {
            const response = await fetch(`${getFav}/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setFavoriteBars(data);
            } else {
                console.error("Failed to fetch favorites");
            }
        } catch (error) {
            console.error("Error fetching favorites:", error);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, [userId]);

    const handleDeleteFavorite = async (barId: number) => {
        const authToken = localStorage.getItem('authToken');

        try {
            const response = await fetch(`${deleteFav}/${userId}/${barId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (response.ok) {
                // Refetch favorites after successful deletion
                fetchFavorites();
            } else {
                console.error("Failed to delete favorite");
            }
        } catch (error) {
            console.error("Error deleting favorite:", error);
        }

    };

    const handleDeleteAllFavorites = () => {
        setShowConfirmation(true);
    };

    const cancelDeleteAllFavorites = () => {
        setShowConfirmation(false);
    };

    const confirmDeleteAllFavorites = async () => {
        const authToken = localStorage.getItem('authToken');
        setShowConfirmation(false);

        try {
            const response = await fetch(`${clearFav}/${userId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (response.ok) {
                // Refetch favorites after successful deletion
                fetchFavorites();
            } else {
                console.error("Failed to delete all favorites");
            }
        } catch (error) {
            console.error("Error deleting all favorites:", error);
        }
    };

    const renderSelection = () => {
        if (renderOption == 'accountSetting') {
            return (
                <div>
                    <h5>Account Information</h5>
                    <div className="header-bar"></div>
                    <div className="pt-3 d-flex flex-column user-info">
                        <div className="p-2 fs-5">Username: </div>
                        <input className="form-control mb-2" type="text" value={username ? username : "Not logged in"} aria-label="readonly input example" readOnly />

                        <div className="p-2 fs-5">Email: </div>
                        <input className="form-control mb-2" type="text" value={email ? email : "Not logged in"} aria-label="readonly input example" readOnly />

                        <div className="p-2 fs-5">Change Username:</div>
                        <input type="text" className="form-control mb-2" id="exampleFormControlInput1" placeholder="Current Username" />
                        <input type="text" className="form-control mt-1" id="exampleFormControlInput1" placeholder="New Username" />
                        <button type="button" className="btn btn-primary btn-style w-75 mt-3">Confirm</button>

                        <div className="p-2 fs-5">Update Password:</div>
                        <input type="text" className="form-control mb-2" id="exampleFormControlInput1" placeholder="Old Password" />
                        <input type="text" className="form-control mt-1" id="exampleFormControlInput1" placeholder="New Password" />
                        <button type="button" className="btn btn-primary btn-style w-75 mt-3">Confirm</button>
                    </div>
                </div>
            );
        }
        else if (renderOption == 'securityPrivacy') {
            return (
                <div>
                    <h5>Security & Privacy</h5>
                    <div className="header-bar"></div>

                    <div className="pt-3 d-flex security-section">
                        <h5>Tracking</h5>
                    </div>
                    <div className="d-flex flex-column tracking-header">
                        <p>We keep track of your location and your visited bars for analytical purposes</p>
                    </div>

                    <div className="d-flex flex-row mb-3 gap-5 tracking-setting">
                        <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" id="flexSwitchCheckChecked" checked={trackLocation} onClick={() => setLocationOption(!trackLocation)} />
                            <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Toggle Geolocation</label>
                        </div>

                        <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" id="flexSwitchCheckChecked" checked={trackBars} onClick={() => setTrackedBars(!trackBars)} />
                            <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Toggle sharing visited bar</label>
                        </div>
                    </div>
                </div>
            )
        }
        else if (renderOption == 'preferences') {
            return (
                <div>
                    <h5>Preferences</h5>
                    <div className="header-bar"></div>


                    <div className="pt-3 d-flex security-section">
                        <h5>Timer</h5>
                    </div>
                    <div className="d-flex flex-column tracking-header">
                        <p>We keep track of your time out when your out drinking and with a group</p>
                    </div>

                    <div className="preference-setting">
                        <div className="d-flex flex-row mb-3 gap-3 tracking-setting">
                            <p>Do you wish to have a timer on?</p>
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" id="flexSwitchCheckChecked" checked={trackLocation} onClick={() => setLocationOption(!trackLocation)} />
                                <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Toggle Timer</label>
                            </div>
                        </div>

                        <div className="d-flex flex-row mb-3 gap-3 tracking-setting">
                            <p>Current Set Timer</p>
                            <TimerInput readOnly={true} />
                            <p>Do you wish to update the timer?</p>
                            <TimerInput readOnly={false} />
                        </div>
                    </div>

                </div>
            )
        }
        else if (renderOption == 'favoriteBars') {
            return (
                <div className="favorite-bars">
                    <h5 className="d-flex justify-content-between align-items-center">
                        Favorite Bars
                        {favoriteBars && favoriteBars.favorites && favoriteBars.favorites.length > 0 && (
                            <button 
                            className="btn btn-danger delete-all-btn" 
                            onClick={handleDeleteAllFavorites} 
                            style={{backgroundColor: '#EEA40C', borderColor: '#EEA40C', color: 'black'}}>
                                Delete All
                            </button>
                        )}
                    </h5>
                    <div className="header-bar"></div>
                    {/* Container for images */}
                    <div className="container-fluid pt-3">
                        <div className="row d-flex">
                            {favoriteBars && favoriteBars.favorites && favoriteBars.favorites.length > 0 ? (
                                favoriteBars.favorites.map((bar, index) => (
                                    <div key={index} className="col-md-4 mb-3">
                                        {/* Render the image if available, or a placeholder */}
                                        {bar.imageURL ? (
                                            <img src={bar.imageURL} alt={bar.barName} className="img-fluid" />
                                        ) : (
                                            <img src={unavailableImage} alt={bar.barName} className="img-fluid" />
                                        )}
                                        <div className="bar-details d-flex flex-column align-items-center">
                                            <h6 className="text-center">{bar.barName}</h6>
                                            {/* Display notes if available */}
                                            {bar.note && (
                                                <div className="note-container">
                                                    <div className="note-box">{bar.note}</div>
                                                </div>
                                            )}
                                            {/* Delete button */}
                                            <button
                                                className="btn btn-danger btn-sm mt-auto"
                                                onClick={() => handleDeleteFavorite(bar.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-12">
                                    <h6 className="text-center">No favorites</h6>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        };
    };


    return (
        <div className="profile-page" style={{
            backgroundColor: "#646463",
            height: "100vh"
          }}>
            <div className="container">
                <div className="profile-header pt-5">
                    <h2 className="fs-2" style={{color: "white"}}>Profile</h2>
                </div>
                <div className="header-bar"></div>
                <div className="row">
                    <div className="col-md-5 col-sm-6 pt-3 side-area">
                        <div className="card card-orientation">
                            <div className="card-body">
                                <ul className="pt-1">
                                    <li className="list-element"><RiAccountCircleFill style={{ color: '#0366fc' }} className="icon-style primary" /><button onClick={() => setOption('accountSetting')} className="btn btn-txt ">Account Setting</button></li>
                                    <li className="list-element"><MdPrivacyTip style={{ color: '#4c4a52' }} className="icon-style" /><button onClick={() => setOption('securityPrivacy')} className="btn btn-txt ">Security & Privacy</button></li>
                                    <li className="list-element"><IoSettingsSharp className="icon-style" /><button onClick={() => setOption('preferences')} className="btn btn-txt ">Preferences</button></li>
                                    <li className="list-element"><IoRibbon style={{ color: '#d61c57' }} className="icon-style" /><button onClick={() => setOption('favoriteBars')} className="btn btn-txt ">Favorite Bars</button></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-7 col-sm-6 pt-3 side-content">
                        <div className="card card-orientation">
                            <div className="card-body">
                                {renderSelection()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Render ConfirmationPopup conditionally */}
            {showConfirmation && (
                <div className="modal fade show" tabIndex={-1} role="dialog" style={{ display: 'block' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <ConfirmationPopup
                                    onConfirm={confirmDeleteAllFavorites}
                                    onCancel={cancelDeleteAllFavorites}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile