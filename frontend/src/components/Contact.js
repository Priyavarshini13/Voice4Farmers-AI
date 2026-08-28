import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you</p>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <h2>Get In Touch</h2>
            <p style={{color: '#4a5568'}}>Have questions or feedback? Reach out to us through any of the following channels:</p>
            
            <div className="contact-item">
              <div className="contact-icon">📧</div>
              <div>
                <h3>Email</h3>
                <p>support@voice4farmers.com</p>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">📞</div>
              <div>
                <h3>Phone</h3>
                <p>+91 1800-XXX-XXXX (Toll Free)</p>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <div>
                <h3>Address</h3>
                <p>Agricultural Innovation Hub<br/>Technology Park, Bangalore<br/>Karnataka, India - 560001</p>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">⏰</div>
              <div>
                <h3>Working Hours</h3>
                <p>Monday - Saturday: 9:00 AM - 6:00 PM<br/>Sunday: Closed</p>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <h2>Send Us a Message</h2>
            {submitted && <div className="success-message">✓ Message sent successfully!</div>}
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Message</label>
                <textarea 
                  rows="5" 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
              
              <button type="submit" className="btn-primary contact-send-btn">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
