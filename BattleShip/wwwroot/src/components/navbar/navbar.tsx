import { h } from "hyperapp";

export const Navbar = () => (
    <div>
        <nav className="navbar navbar has-shadow" role="navigation" aria-label="main navigation">
            <div className="container">
                <div className="navbar-item">
                    <h1 className="title"> 🚀 BattleShip 🚢 </h1>
                </div>

                <div className="navbar-end">
                    <div className="navbar-item">

                        <button className="button is-danger" onClick={() => {
                        } /*args.actions.askBackToLobby() */}><i className="fas fa-sign-out-alt"/> &nbsp; Leave game
                        </button>
                        
                    </div>
                </div>

            </div>
        </nav>


    </div>
);