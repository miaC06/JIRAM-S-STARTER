import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Shield,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CIVILIAN'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [serverError, setServerError] = useState('');

  const roles = [
    { value: 'CIVILIAN', label: 'Civilian', desc: 'File and track cases' },
    { value: 'REGISTRAR', label: 'Registrar', desc: 'Manage case registration' },
    { value: 'JUDGE', label: 'Judge', desc: 'Review and decide cases' },
    { value: 'PROSECUTOR', label: 'Prosecutor', desc: 'Prosecute cases' }
  ];

  // Validation functions
  const validateUsername = (username) => {
    const errors = [];
    
    if (username.length < 6 || username.length > 15) {
      errors.push('Username must be 6-15 characters');
    }
    
    if (!/^[a-zA-Z0-9-]+$/.test(username)) {
      errors.push('Only letters, numbers, and hyphens allowed');
    }
    
    const letterCount = (username.match(/[a-zA-Z]/g) || []).length;
    if (letterCount < 4) {
      errors.push('At least 4 letters required');
    }
    
    return errors;
  };

  const validateEmail = (email) => {
    const errors = [];
    
    // Skip validation if email is empty (will be caught by required attribute)
    if (!email) return errors;
    
    // Count letters FIRST (only alphabetic characters)
    const letterCount = (email.match(/[a-zA-Z]/g) || []).length;
    console.log(`=== EMAIL VALIDATION ===`);
    console.log(`Email: "${email}"`);
    console.log(`Total length: ${email.length}`);
    console.log(`Letter count: ${letterCount}`);
    console.log(`=======================`);
    
    // Length validation
    if (email.length < 6) {
      errors.push('Email must be at least 6 characters');
    }
    if (email.length > 20) {
      errors.push('Email must be max 20 characters');
    }
    
    // Letter count validation - MUST HAVE AT LEAST 4 LETTERS
    if (letterCount < 4) {
      errors.push(`Must contain at least 4 letters (found ${letterCount})`);
    }
    
    // Format validation
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      errors.push('Invalid email format (must be user@domain.com)');
    }
    
    return errors;
  };

  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 6 || password.length > 20) {
      errors.push('Password must be 6-20 characters');
    }
    
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation for better UX
    if (value) {
      let fieldErrors = [];
      switch(name) {
        case 'username':
          fieldErrors = validateUsername(value);
          break;
        case 'email':
          fieldErrors = validateEmail(value);
          break;
        case 'password':
          fieldErrors = validatePassword(value);
          break;
        case 'confirmPassword':
          if (value !== formData.password) {
            fieldErrors = ['Passwords do not match'];
          }
          break;
        default:
          break;
      }
      setErrors(prev => ({ ...prev, [name]: fieldErrors }));
    } else {
      // Clear errors if field is empty
      setErrors(prev => ({ ...prev, [name]: [] }));
    }
    
    setServerError('');
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let fieldErrors = [];
    
    switch(name) {
      case 'username':
        fieldErrors = validateUsername(value);
        break;
      case 'email':
        fieldErrors = validateEmail(value);
        break;
      case 'password':
        fieldErrors = validatePassword(value);
        break;
      case 'confirmPassword':
        if (value !== formData.password) {
          fieldErrors = ['Passwords do not match'];
        }
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: fieldErrors }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccess('');
    
    // Validate all fields
    const usernameErrors = validateUsername(formData.username);
    const emailErrors = validateEmail(formData.email);
    const passwordErrors = validatePassword(formData.password);
    const confirmErrors = formData.password !== formData.confirmPassword 
      ? ['Passwords do not match'] 
      : [];
    
    const allErrors = {
      username: usernameErrors,
      email: emailErrors,
      password: passwordErrors,
      confirmPassword: confirmErrors
    };
    
    setErrors(allErrors);
    
    // Check if there are any errors
    const hasErrors = Object.values(allErrors).some(err => err.length > 0);
    if (hasErrors) return;
    
    setLoading(true);
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      
      setSuccess('✅ Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
      const errorMsg = err.response?.data?.detail || 'Registration failed. Please try again.';
      setServerError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join the JIRAMS Case Management System</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-800">{success}</p>
            </div>
          )}

          {/* Server Error */}
          {serverError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.username?.length > 0 ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="john-doe123"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                6-15 chars, letters/numbers/hyphens, min 4 letters
              </p>
              {errors.username?.length > 0 && (
                <div className="mt-1 space-y-1">
                  {errors.username.map((error, idx) => (
                    <p key={idx} className="text-xs text-red-600">• {error}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email?.length > 0 ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="user@court.com"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">6-20 chars, min 4 letters</p>
              {errors.email?.length > 0 && (
                <div className="mt-1 space-y-1">
                  {errors.email.map((error, idx) => (
                    <p key={idx} className="text-xs text-red-600">• {error}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.password?.length > 0 ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">6-20 characters</p>
              {errors.password?.length > 0 && (
                <div className="mt-1 space-y-1">
                  {errors.password.map((error, idx) => (
                    <p key={idx} className="text-xs text-red-600">• {error}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.confirmPassword?.length > 0 ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword?.length > 0 && (
                <div className="mt-1 space-y-1">
                  {errors.confirmPassword.map((error, idx) => (
                    <p key={idx} className="text-xs text-red-600">• {error}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Role *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {roles.map((role) => (
                  <label
                    key={role.value}
                    className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.role === role.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={formData.role === role.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <Shield className={`w-5 h-5 mr-3 ${
                      formData.role === role.value ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{role.label}</div>
                      <div className="text-sm text-gray-500">{role.desc}</div>
                    </div>
                    {formData.role === role.value && (
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
