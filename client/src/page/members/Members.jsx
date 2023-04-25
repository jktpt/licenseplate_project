import React from "react";
import "./member.scss";
import { Sidebar } from "../../components/sidebar/Sidebar";
import { Navbar } from "../../components/navbar/Navbar";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import bush from "../../asset/photo/bush.jpg"
import prw from "../../asset/photo/prw.jpg"
import milk from "../../asset/photo/milk.png"
import non from "../../asset/photo/non.png"

export const Members = () => {
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="member-container">
          {/* START CARD */}
          <div class="card-wrapper">
            <div class="card">
              <div class="card-image">
                <img
                  src={"https://media.licdn.com/dms/image/D5603AQEWIBPPbTXb7A/profile-displayphoto-shrink_800_800/0/1674054307605?e=1687392000&v=beta&t=KLjOrmUeqjICrcTF7MbqpT3ibDysYnX1A9oKW4Up1VE"}
                  alt=""
                  className="job-card"
                />
              </div>
              <ul class="social-icons">
                <li>
                  <a href="">
                    <FacebookIcon className="fab"/>
                  </a>
                </li>
                <li>
                  <a href="">
                    <InstagramIcon className="fab"/>
                  </a>
                </li>
                <li>
                  <a href="">
                    <GitHubIcon className="fab"/>
                  </a>
                </li>
                <li>
                  <a href="">
                    <LinkedInIcon className="fab"/>
                  </a>
                </li>
              </ul>
              <div class="details">
                <h2>
                  Krittapak Trakulniyom
                </h2>
              </div>
            </div>
          </div>
          {/* END CARD */}
          <div class="card-wrapper">
            <div class="card">
              <div class="card-image">
                <img
                  src={bush}
                  alt=""
                  className="bush-card"
                />
              </div>
              <ul class="social-icons">
                <li>
                  <a href="">
                    <FacebookIcon className="fab"/>
                  </a>
                </li>
                <li>
                  <a href="">
                    <InstagramIcon className="fab"/>
                  </a>
                </li>
                <li>
                  <a href="">
                    <GitHubIcon className="fab"/>
                  </a>
                </li>
                <li>
                  <a href="">
                    <LinkedInIcon  className="fab"/>
                  </a>
                </li>
              </ul>
              <div class="details">
                <h2>
                  Chakkapat Sriboonruang
                  <span class="job-title">Developer</span>
                </h2>
              </div>
            </div>
          </div>
          {/* END CARD 2 */}
          <div class="card-wrapper">
            <div class="card">
              <div class="card-image">
                <img
                  src={non}
                  alt=""
                  className="non-card"
                />
              </div>
              <ul class="social-icons">
                <li>
                  <a href="">
                    <FacebookIcon className="fab"/>
                  </a>
                </li>
                <li>
                  <a href="">
                    <InstagramIcon className="fab"/>
                  </a>
                </li>
                <li>
                  <a href="">
                    <GitHubIcon className="fab"/>
                  </a>
                </li>
                <li>
                  <a href="">
                    <LinkedInIcon className="fab"/>
                  </a>
                </li>
              </ul>
              <div class="details">
                <h2>
                  Keerintorn bonoy
                </h2>
              </div>
            </div>
          </div>
          {/* END CARD 3  */}
        </div>
        <div className="member-container">
          <div class="card-wrapper">
            <div class="card">
              <div class="card-image">
                <img
                  src={prw}
                  alt=""
                  className="prw-card"
                />
              </div>
              <ul class="social-icons">
                <li>
                  <a href="">
                    <FacebookIcon className="fab"/>
                  </a>
                </li>
                <li>
                  <a href="">
                    <InstagramIcon className="fab"/>
                  </a>
                </li>
                <li>
                  <a href="">
                    <GitHubIcon className="fab"/>
                  </a>
                </li>
                <li>
                  <a href="">
                    <LinkedInIcon className="fab"/>
                  </a>
                </li>
              </ul>
              <div class="details">
                <h2>
                  Chanoknard Silaphetjaras
                </h2>
              </div>
            </div>
          </div>
          {/* END CARD 4  */}
          <div class="card-wrapper">
            <div class="card">
              <div class="card-image">
                <img
                  src={milk}
                  alt=""
                  className="milk-card"
                />
              </div>
              <ul class="social-icons">
                <li>
                  <a href="">
                    <FacebookIcon className="fab"/>
                  </a>
                </li>
                <li>
                  <a href="">
                    <InstagramIcon className="fab"/>
                  </a>
                </li>
                <li>
                  <a href="">
                    <GitHubIcon className="fab"/>
                  </a>
                </li>
                <li>
                  <a href="">
                    <LinkedInIcon className="fab" />
                  </a>
                </li>
              </ul>
              <div class="details">
                <h2>
                  Thitaporn prasitsom
                </h2>
              </div>
            </div>
          </div>
          {/* END CARD 5 */}
        </div>
      </div>
    </div>
  );
};
