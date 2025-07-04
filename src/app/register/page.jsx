'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import RegisterStepper from '../../components/register/RegisterStepper';
import './RegisterPage.css';

const RegisterPage = () => {
  const router = useRouter();
  const { user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/profiles');
    }
  }, [user, router]);

  return (
    <div className="register-page">
      <RegisterStepper />
    </div>
  );
};

export default RegisterPage;
