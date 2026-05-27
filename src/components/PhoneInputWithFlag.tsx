'use client';

import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import {
  getExampleNumber,
  getCountryCallingCode,
  isValidPhoneNumber,
} from 'libphonenumber-js';
import examples from 'libphonenumber-js/examples.mobile.json';
import type { CountryCode } from 'libphonenumber-js';

interface PhoneInputWithFlagProps {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
  className?: string;
}

export default function PhoneInputWithFlag({
  value,
  onChange,
  className,
}: PhoneInputWithFlagProps) {
  const [countryCode, setCountryCode] = useState<string>('br');
  const [placeholder, setPlaceholder] = useState<string>('(11) 99999-9999');

  const updatePlaceholder = (iso2: string) => {
    try {
      if (!iso2) return;
      const phoneNumber = getExampleNumber(
        iso2.toUpperCase() as CountryCode,
        examples,
      );
      if (phoneNumber) {
        setPlaceholder(phoneNumber.formatNational());
      } else {
        setPlaceholder('DDD + Whatsapp');
      }
    } catch (e) {
      console.error('Error generating placeholder:', e);
      setPlaceholder('DDD + Whatsapp');
    }
  };

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.country_code) {
          const code = data.country_code.toLowerCase();
          setCountryCode(code);
          updatePlaceholder(code);
        }
      })
      .catch((err) => console.error('Error fetching country code:', err));
  }, []);

  const handleOnChange = (
    val: string,
    data: { dialCode?: string; countryCode?: string; format?: string },
  ) => {
    let phoneValue = val;
    if (data && data.dialCode) {
      if (val && !val.startsWith(data.dialCode)) {
        phoneValue = data.dialCode + val;
      }
    }

    if (data && data.countryCode && data.countryCode !== countryCode) {
      setCountryCode(data.countryCode);
      updatePlaceholder(data.countryCode);
    }

    let isValid = false;
    try {
      if (phoneValue) {
        isValid = isValidPhoneNumber('+' + phoneValue);
      }
    } catch {
      if (data && data.format) {
        const digitsOnly = phoneValue.replace(/\D/g, '');
        const ddiLength = data.dialCode ? data.dialCode.length : 0;
        const numberLength = digitsOnly.length - ddiLength;
        isValid = numberLength >= 10;
      } else {
        isValid = phoneValue.length >= 10;
      }
    }

    onChange(phoneValue, isValid);
  };

  let displayValue = value;
  try {
    if (countryCode && value) {
      const dialCode = getCountryCallingCode(
        countryCode.toUpperCase() as CountryCode,
      );
      if (value.startsWith(dialCode)) {
        displayValue = value.substring(dialCode.length);
      }
    }
  } catch {
    // Ignora erros de country code inválido
  }

  return (
    <div className={`phone-input-container ${className ?? ''}`}>
      <PhoneInput
        country={countryCode}
        value={displayValue}
        onChange={handleOnChange}
        inputProps={{
          name: 'phone',
          required: true,
          autoFocus: false,
        }}
        containerClass="!w-full"
        inputClass="!w-full"
        buttonClass=""
        dropdownClass=""
        searchClass=""
        specialLabel=""
        placeholder={placeholder}
        enableSearch={true}
        disableSearchIcon={false}
        autoFormat={true}
        preferredCountries={['br', 'us', 'pt']}
        disableCountryCode={true}
        disableCountryGuess={true}
        preserveOrder={['onlyCountries', 'preferredCountries']}
        masks={{ br: '(..) .....-....', ar: '... ..-....-....' }}
      />
      <style jsx global>{`
        .react-tel-input .form-control {
          width: 100% !important;
          height: 48px !important;
          background: var(--color-v1-paper) !important;
          color: var(--color-v1-ink) !important;
          border: 1px solid rgba(10, 10, 10, 0.15) !important;
          border-radius: 0.75rem !important;
          padding-left: 56px !important;
          font-size: 1rem !important;
          transition: border-color 0.15s ease;
        }
        .react-tel-input .form-control::placeholder {
          color: var(--color-v1-muted) !important;
          opacity: 0.6 !important;
        }
        .react-tel-input .form-control:focus {
          border-color: var(--color-v1-gold) !important;
          box-shadow: none !important;
          outline: none !important;
        }
        .react-tel-input .flag-dropdown {
          background: var(--color-v1-paper) !important;
          border: 1px solid rgba(10, 10, 10, 0.15) !important;
          border-right: none !important;
          border-radius: 0.75rem 0 0 0.75rem !important;
        }
        .react-tel-input .flag-dropdown.open {
          background: var(--color-v1-paper) !important;
          border-radius: 0.75rem 0 0 0.75rem !important;
        }
        .react-tel-input .selected-flag {
          background: transparent !important;
          border-radius: 0.75rem 0 0 0.75rem !important;
          width: 48px !important;
          padding: 0 0 0 12px !important;
        }
        .react-tel-input .selected-flag .arrow {
          border-top-color: var(--color-v1-muted) !important;
        }
        .react-tel-input .selected-flag .arrow.up {
          border-bottom-color: var(--color-v1-muted) !important;
        }
        .react-tel-input .selected-flag:hover,
        .react-tel-input .selected-flag:focus,
        .react-tel-input .flag-dropdown.open .selected-flag {
          background-color: var(--color-v1-bg) !important;
        }
        .react-tel-input .country-list {
          background-color: var(--color-v1-paper) !important;
          color: var(--color-v1-ink) !important;
          border: 1px solid rgba(10, 10, 10, 0.15) !important;
          border-radius: 0.75rem !important;
          box-shadow: 0 12px 32px rgba(10, 10, 10, 0.08) !important;
          margin-top: 4px !important;
        }
        .react-tel-input .country-list .country {
          color: var(--color-v1-ink) !important;
        }
        .react-tel-input .country-list .country .dial-code {
          color: var(--color-v1-muted) !important;
        }
        .react-tel-input .country-list .country.highlight {
          background-color: var(--color-v1-bg) !important;
        }
        .react-tel-input .country-list .country:hover {
          background-color: var(--color-v1-bg) !important;
        }
        .react-tel-input .country-list .divider {
          border-bottom-color: rgba(10, 10, 10, 0.08) !important;
        }
        .react-tel-input .country-list .search {
          background-color: var(--color-v1-paper) !important;
          padding: 10px !important;
        }
        .react-tel-input .country-list .search-box {
          background-color: #ffffff !important;
          color: var(--color-v1-ink) !important;
          border: 1px solid rgba(10, 10, 10, 0.15) !important;
          border-radius: 0.5rem !important;
          margin-left: 0 !important;
          width: 100% !important;
        }
        .react-tel-input .country-list .search-box::placeholder {
          color: var(--color-v1-muted) !important;
          opacity: 0.6 !important;
        }
        .react-tel-input .country-list .search-emoji {
          color: var(--color-v1-muted) !important;
        }
      `}</style>
    </div>
  );
}
