import React from 'react';.
import './Home.css'; // Import the CSS file
import vehicleImage from './backpic.jpeg'; // Import your vehicle image

const Home = () => {
    return (
        <div className="home-container">
            <div className="home-content">
                <h1>Welcome to Skynet Driving and Computer School</h1>
                
                <section className="paragraph-container">
                    <p>
                        At Skynet Driving and Computer School, we are committed to providing the best educational experiences in driving and computer skills. Whether you're looking to start a new career or enhance your existing skills, we have a variety of courses designed to meet your needs.
                    </p>
                </section>
                
                <section className="paragraph-container">
                    <p>
                        Explore our offerings and find the perfect program for you. With experienced instructors and state-of-the-art facilities, Skynet is your gateway to success.
                    </p>
                </section>
                
                <section className="feature-sections">
                    <div className="feature">
                        <h2>Expert Instructors</h2>
                        <p>
                            Learn from industry professionals who bring years of experience to the classroom. Our instructors are dedicated to helping you achieve your goals with personalized attention and expert guidance.
                        </p>
                    </div>
                    
                    <div className="feature">
                        <h2>Modern Facilities</h2>
                        <p>
                            Our state-of-the-art facilities provide a comfortable and high-tech learning environment. From cutting-edge computers to advanced driving simulators, you'll have everything you need to succeed.
                        </p>
                    </div>
                    
                    <div className="feature">
                        <h2>Flexible Scheduling</h2>
                        <p>
                            We offer flexible course schedules to fit your busy life. Choose from a variety of times and formats to find the perfect fit for your needs.
                        </p>
                    </div>
                </section>
                
                <section className="testimonials">
                    <h2>What Our Students Say</h2>
                    
                    <div className="paragraph-container">
                        <blockquote>
                            <p>
                                "Skynet provided me with the skills and confidence I needed to excel in my new career. The instructors were top-notch and the facilities were fantastic!"
                            </p>
                            <footer>-  Reagan M.</footer>
                        </blockquote>
                    </div>
                    
                    <div className="paragraph-container">
                        <blockquote>
                            <p>
                                "The computer courses at Skynet were incredibly helpful. The hands-on approach made learning fun and effective. Highly recommend!"
                            </p>
                            <footer>- John N.</footer>
                        </blockquote>
                    </div>
                </section>
                
                <div className="advertisement">
                <img 
  src={vehicleImage} 
  alt="Our Vehicles" 
  style={{ maxWidth: '100%', height: 'auto' }} 
/>

                    <div className="advertisement-content">
                        <h2>Discover Our Vehicles</h2>
                        <p>
                            At Skynet, we use top-of-the-line vehicles to ensure that you receive the best driving experience possible. Our fleet is well-maintained and equipped with the latest technology to help you become a confident and skilled driver.
                        </p>
                        <p>
                            Explore our diverse range of vehicles designed to meet various driving needs. Whether you're learning to drive for the first time or preparing for advanced driving techniques, our vehicles provide the perfect platform for your journey.
                        </p>
                        <p>
                            Get a closer look at our vehicles and see why Skynet Driving and Computer School is the best choice for your driving education.
                        </p>
                    </div>
                </div>
                <div>
                <i><h1>Get in Touch:
    <a href="tel:0725595601">0725595601</a> OR 
    <a href="tel:0725596000">0725596000</a>
</h1></i>


                </div>
                
                <div className="call-to-action">
                    <h2 className='new'><a href="/register">REGISTER NOW</a > to get started or <a href="/login">LOGIN</a> if you already have an account.</h2>
                </div>
            </div>
        </div>
    );
};

export default Home;
