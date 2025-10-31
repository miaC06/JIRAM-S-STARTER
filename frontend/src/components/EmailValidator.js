import React, { useState } from 'react';

export default function EmailValidator() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState([]);

  const validateEmail = (email) => {
    const errors = [];
    
    if (!email) return errors;
    
    // Count letters
    const letterCount = (email.match(/[a-zA-Z]/g) || []).length;
    
    // Length validation
    if (email.length < 6) {
      errors.push('Email must be at least 6 characters');
    }
    if (email.length > 20) {
      errors.push('Email must be max 20 characters');
    }
    
    // Letter count validation - CRITICAL
    if (letterCount < 4) {
      errors.push(`Must contain at least 4 letters (found ${letterCount})`);
    }
    
    // Format validation
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      errors.push('Invalid email format');
    }
    
    return errors;
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setErrors(validateEmail(value));
  };

  const letterCount = (email.match(/[a-zA-Z]/g) || []).length;

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow">
      <h3 className="text-lg font-bold mb-4">Email Validator Test</h3>
      
      <input
        type="text"
        value={email}
        onChange={handleChange}
        placeholder="Type email here..."
        className="w-full px-3 py-2 border rounded mb-2"
      />
      
      <div className="mb-4 text-sm">
        <p>Length: {email.length}</p>
        <p>Letters: {letterCount}</p>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded p-3">
          <p className="font-semibold text-red-800 mb-2">Errors:</p>
          {errors.map((err, idx) => (
            <p key={idx} className="text-red-600 text-sm">• {err}</p>
          ))}
        </div>
      )}

      {errors.length === 0 && email.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded p-3">
          <p className="text-green-800 font-semibold">✅ Valid email!</p>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p className="font-semibold mb-1">Test Cases:</p>
        <p>❌ "123@45.com" - Only 2 letters (c, o, m)</p>
        <p>❌ "12345@6.co" - Only 2 letters (c, o)</p>
        <p>✅ "test@ab.com" - 6 letters (t,e,s,t,a,b,c,o,m)</p>
        <p>✅ "user@t.com" - 6 letters</p>
      </div>
    </div>
  );
}
