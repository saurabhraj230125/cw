"use client";

interface FieldProps {
  label: string;
  required?: boolean;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (val: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  isSelect?: boolean;
  options?: string[];
  width?: string; // e.g., 'w-full', 'w-[200px]'
}

export function Field({ 
  label, 
  required = false, 
  value,
  defaultValue,
  onChange,
  placeholder = "", 
  type = "text",
  disabled = false,
  isSelect = false,
  options = [],
  width = "w-full"
}: FieldProps) {
  
  const isControlled = value !== undefined;
  const valueProps = isControlled ? { value } : { defaultValue };

  return (
    <div className="flex items-start mb-2.5">
      {/* Right-aligned rigid label */}
      <label className="w-[160px] shrink-0 text-right pr-3 text-erp-base text-black pt-1 font-bold leading-tight">
        {required && <span className="text-cw-red">*</span>} {label} :
      </label>
      
      <div className={`flex-1 max-w-sm ${width}`}>
        {isSelect ? (
          <select 
            disabled={disabled}
            {...valueProps}
            onChange={(e) => onChange && onChange(e.target.value)}
            className="w-full cursor-pointer"
          >
            {options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : (
          <input 
            type={type} 
            {...valueProps}
            onChange={(e) => onChange && onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full" 
          />
        )}
      </div>
    </div>
  );
}