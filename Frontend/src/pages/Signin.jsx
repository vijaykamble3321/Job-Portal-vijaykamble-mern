import React, { useState } from 'react';
import API from '../../../../Job-Portal/Frontend/utils/API';

const Signin = () => {
  const [view, setView] = useState('signin');
  const [form, setForm] = useState({
    fname: '',
    lname: '',
    email: '',
    password: '',
    mobile: '',
    role: 'user',
    otp: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/api/public/auth/signin', {
        email: form.email,
        password: form.password,
      });
      localStorage.setItem('token', res.data.accessToken);
      setMessage('Sign in successful!');
    } catch (err) {
      console.error(err);
      setMessage('Invalid credentials.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await API.post('/api/public/auth/signup', form);
      setMessage('Sign up successful!');
      setView('signin');
    } catch (err) {
      setMessage('Sign up failed. Email may already be registered.');
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/api/public/auth/forgot', { email: form.email });
      setMessage(`OTP sent: ${res.data.data.otp}`);
      setView('reset');
    } catch (err) {
      setMessage('Email not found.');
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await API.post('/api/public/auth/reset', {
        email: form.email,
        otp: form.otp,
        password: form.password,
      });
      setMessage('Password reset successful!');
      setView('signin');
    } catch (err) {
      setMessage('Invalid OTP or email.');
    }
  };

  const renderForm = () => {
    switch (view) {
      case 'signin':
        return (
          <form onSubmit={handleSignin}>
            <Input label="Email" name="email" value={form.email} onChange={handleChange} />
            <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} />
            <SubmitButton text="Sign In" />
          </form>
        );
      case 'signup':
        return (
          <form onSubmit={handleSignup}>
            <Input label="First Name" name="fname" value={form.fname} onChange={handleChange} />
            <Input label="Last Name" name="lname" value={form.lname} onChange={handleChange} />
            <Input label="Email" name="email" value={form.email} onChange={handleChange} />
            <Input label="Mobile" name="mobile" value={form.mobile} onChange={handleChange} />
            <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} />
            <Input label="Role" name="role" value={form.role} onChange={handleChange} />
            <SubmitButton text="Sign Up" />
          </form>
        );
      case 'forgot':
        return (
          <form onSubmit={handleForgot}>
            <Input label="Email" name="email" value={form.email} onChange={handleChange} />
            <SubmitButton text="Send OTP" />
          </form>
        );
      case 'reset':
        return (
          <form onSubmit={handleReset}>
            <Input label="Email" name="email" value={form.email} onChange={handleChange} />
            <Input label="OTP" name="otp" value={form.otp} onChange={handleChange} />
            <Input label="New Password" name="password" type="password" value={form.password} onChange={handleChange} />
            <SubmitButton text="Reset Password" />
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4 capitalize">{view}</h2>
        {renderForm()}
        {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}
        <div className="flex justify-between mt-4 text-sm">
          {view !== 'signup' && <button onClick={() => setView('signup')} className="text-blue-600">Sign Up</button>}
          {view !== 'signin' && <button onClick={() => setView('signin')} className="text-green-600">Sign In</button>}
          {view === 'signin' && <button onClick={() => setView('forgot')} className="text-purple-600">Forgot?</button>}
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, name, value, onChange, type = 'text' }) => (
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      required
    />
  </div>
);

const SubmitButton = ({ text }) => (
  <button
    type="submit"
    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full"
  >
    {text}
  </button>
);

export default Signin;
