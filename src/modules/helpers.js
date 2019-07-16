import { useState } from 'react';

export function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function isEmptyObject(obj) {
  if (!obj) {
    return true;
  }
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

export function copyArray(arr) {
  return [...(arr || [])];
}

export function deepCopyObject(obj) {
  // NOTE: defined methods aren't coming with this
  return JSON.parse(JSON.stringify(obj));
}

export function to(promise) {
  return promise
    .then(data => {
      return [null, data];
    })
    .catch(err => [err]);
}

export const useStateWithNullableDefault = (nullableDefault, fallbackVal = '') => {
  return useState(nullableDefault != null ? nullableDefault : fallbackVal);
};
