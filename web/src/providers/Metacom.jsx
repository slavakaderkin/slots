import { useEffect, useState, createContext } from 'react';
import { Metacom } from '@metacom';
import Info from '@pages/Info';

export const context = createContext(null);

const sample = (array, random = Math.random) => {
  const index = Math.floor(random() * array.length);
  return array[index];
};

const PORTS = ['8000', '8001', '8002'];
const HOST = import.meta.env.VITE_HOST;
const DEV_HOST = import.meta.env.VITE_DEV_HOST
const PROTOCOL = 'wss'
const API_URL = import.meta.env.PROD 
  ? `${PROTOCOL}://${HOST}:${sample(PORTS)}/api` 
  : `${PROTOCOL}://${DEV_HOST}/api`; // 'ws://localhost:8000/api' //
  
const units = [
  'auth', 
  'files', 
  'profile', 
  'account', 
  'booking', 
  'service',
  'slot',
  'feedback',
  'client',
  'geo',
  'subscription'
];

export const createMetacom = async () => {
  const metacom = Metacom.create(API_URL);
  await metacom.load(...units);
  return metacom;
};

export default ({ children }) => {
  const [metacom, setMetacom] = useState(null);

  useEffect(() => {
    createMetacom().then((metacom) => setMetacom(metacom));
  }, []);

  if (!metacom) return <Info type="loading" />

  return (
    <context.Provider value={metacom}>
      {children}
    </context.Provider>
  );
};
