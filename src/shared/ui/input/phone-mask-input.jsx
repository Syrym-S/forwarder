import { forwardRef, useRef } from "react";
import { IMaskInput } from "react-imask";
import { handlePhonePaste } from "../../helpers/handle-phone-paste";

const PhoneMaskInput = forwardRef(function PhoneMaskInput(
  { name, onChange, ...props },
  ref,
) {
  const inputRef = useRef(null);

  return (
    <IMaskInput
      {...props}
      name={name}
      type="tel"
      inputMode="tel"
      ref={inputRef}
      inputRef={ref}
      mask="+{7} (000) 000-00-00"
      unmask={false}
      onAccept={(value) => onChange({ target: { name, value } })}
      onPaste={(event) =>
        handlePhonePaste(event, (value) => {
          const mask = inputRef.current.maskRef;
          mask.value = value;
          mask.cursorPos = mask.value.length;
        })
      }
    />
  );
});

export default PhoneMaskInput;
