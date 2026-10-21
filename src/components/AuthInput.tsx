import React, { useState } from 'react';
import { Eye, EyeOff, LucideIcon } from 'lucide-react';

interface AuthInputProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
  icon?: LucideIcon;
}

/**
 * Komponen AuthInput dengan desain Soft Neumorphism & Aksesibilitas
 * Dilengkapi validasi error, target sentuh nyaman (min 44px), dan toggle intip password.
 */
export const AuthInput: React.FC<AuthInputProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  disabled = false,
  autoComplete,
  icon: Icon,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full text-left space-y-1.5">
      {/* Label dengan kontras tinggi */}
      <div className="flex justify-between items-center">
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-[#173C32]"
        >
          {label}
          {required && <span className="text-[#DC2626] ml-1" aria-hidden="true">*</span>}
        </label>
      </div>

      {/* Input container */}
      <div className="relative rounded-xl">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#63746A]">
            <Icon className="w-5 h-5 stroke-[1.75]" />
          </div>
        )}

        <input
          id={id}
          name={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`
            w-full rounded-xl text-base text-[#173C32] placeholder:text-[#63746A]/60
            h-12 px-4 ${Icon ? 'pl-11' : 'pl-4'} ${isPassword ? 'pr-12' : 'pr-4'}
            neu-input
            disabled:opacity-60 disabled:cursor-not-allowed
            ${error ? 'neu-input-error' : ''}
          `}
        />

        {/* Tombol Tampil / Sembunyikan Password */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={disabled}
            aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#63746A] hover:text-[#173C32] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#245746] rounded-lg transition-colors cursor-pointer"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5 stroke-[1.75]" />
            ) : (
              <Eye className="w-5 h-5 stroke-[1.75]" />
            )}
          </button>
        )}
      </div>

      {/* Pesan Error */}
      {error && (
        <p
          id={`${id}-error`}
          className="text-xs font-medium text-[#DC2626] mt-1 pl-1 flex items-center gap-1"
          role="alert"
        >
          <span className="inline-block w-1 h-1 rounded-full bg-[#DC2626]"></span>
          {error}
        </p>
      )}
    </div>
  );
};
