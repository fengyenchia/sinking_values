"use client"
import Link from "next/link";
import React from "react";

// 定義支援的顏色樣式
type ButtonVariant = "white" | "blue" | "black";

type ActionButtonProps = {
  /** 文字或節點 */
  text?: React.ReactNode;
  /** 若提供則渲染為 Link，否則為 button */
  href?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  disabled?: boolean;
  /** 🌟 新增顏色選項：white (白), blue (藍), black (黑) */
  variant?: ButtonVariant;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function ActionButton({
  text = "button",
  href,
  onClick,
  disabled = false,
  variant = "white", // 預設為白灰色調
  className = "",
  ...rest
}: ActionButtonProps) {
  
  // 1. 公用基礎樣式（移除了結尾的 className，純粹定義基礎樣式）
  const BASE_FIXED_CLASS = "font-medium border px-8 py-2 backdrop-blur-sm tracking-wider hover:scale-105 active:scale-95 transition-all duration-600 rounded-sm";
  
  // 2. 顏色對應表
  const variantClasses: Record<ButtonVariant, string> = {
    white: "text-[#e2e8f0] border-[#ffffff20] bg-[#ffffff05] hover:bg-[#ffffff20] hover:border-[#ffffff50]",
    blue: "text-[#b9cbe3] border-[#5a6e8540] bg-[#5a6e8510] hover:bg-[#5a6e8530] hover:border-[#8fa3ba60]",
    black: "text-[#1e293b] border-[#0f172a40] bg-[#0f172a10] hover:bg-[#0f172a30] hover:border-[#0f172a60]"
  };

  const currentVariantClass = variantClasses[variant] || variantClasses.white;

  // 3. 將自訂的 className 放至最後方，並加上條件判斷，確保能成功覆蓋前方樣式
  const baseClass = `
    ${BASE_FIXED_CLASS} 
    ${currentVariantClass} 
    ${className} 
    ${disabled ? "opacity-30 pointer-events-none" : "cursor-pointer"}
  `.replace(/\s+/g, ' ').trim(); // 清理多餘的換行與空白

  if (href) {
    return (
      <div className="flex flex-col justify-center items-center gap-4">
        <Link
          href={href}
          className={baseClass}
          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
            if (disabled) e.preventDefault();
            if (onClick) onClick(e);
          }}
        >
          {text}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <button type="button" className={baseClass} onClick={onClick} disabled={disabled} {...rest}>
        {text}
      </button>
    </div>
  );
}
