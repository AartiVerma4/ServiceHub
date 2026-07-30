import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <nav className="col-md-2 d-none d-md-block bg-light sidebar">
          <div className="sidebar-sticky pt-3">
            <ul className="nav flex-column">
              <li className="nav-item">
                <a className="nav-link active" href="#">
                  Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Users
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Services
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Settings
                </a>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Dashboard</h1>
          </div>

          <div className="row">
            {/* Example Cards */}
            <div className="col-md-4 mb-3">
              <div className="card text-white bg-primary">
                <div className="card-body">
                  <h5 className="card-title">Total Users</h5>
                  <p className="card-text">150</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card text-white bg-success">
                <div className="card-body">
                  <h5 className="card-title">Active Services</h5>
                  <p className="card-text">32</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card text-white bg-warning">
                <div className="card-body">
                  <h5 className="card-title">Pending Requests</h5>
                  <p className="card-text">8</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts or Tables */}
          <div className="card mt-4">
            <div className="card-body">
              <h5 className="card-title">Recent Activity</h5>
              <p className="card-text">You can add a table or chart here.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
