'use client';

import { useState, useEffect } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
  };
  ready: () => void;
  expand: () => void;
  close?: () => void;
}

export const useTelegram = () => {
  const [telegram, setTelegram] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkTelegram = () => {
      try {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
          const tg = window.Telegram.WebApp;
          
          tg.ready();
          tg.expand();
          
          setTelegram(tg);
          
          if (tg.initDataUnsafe?.user) {
            setUser(tg.initDataUnsafe.user);
            console.log('✅ Telegram user data loaded');
          } else {
            setError('No user data in Telegram WebApp');
          }
        } else {
          setError('Telegram WebApp not available');
        }
      } catch (err) {
        setError('Failed to initialize Telegram');
        console.error('Telegram init error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    // Telegram script yuklanganligini tekshirish
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      checkTelegram();
    } else {
      const timer = setInterval(() => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
          checkTelegram();
          clearInterval(timer);
        }
      }, 100);
      
      // 5 soniyadan keyin timeout
      setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
          setError('Telegram WebApp timeout');
          clearInterval(timer);
        }
      }, 5000);
    }
  }, []);

  return {
    telegram,
    user,
    isLoading,
    error,
    isTelegramAvailable: !!telegram
  };
};