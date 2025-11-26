import React from 'react';
import { Customization, ColorTheme, FontTheme, MarginTheme } from '../types';

interface CustomizationPanelProps {
  customization: Customization;
  setCustomization: (customization: Customization) => void;
}

const colors: { name: ColorTheme; hex: string }[] = [
  { name: 'orange', hex: '#f97316' },
  { name: 'amber', hex: '#f59e0b' },
  { name: 'emerald', hex: '#10b981' },
  { name: 'rose', hex: '#f43f5e' },
  { name: 'slate', hex: '#64748b' },
  { name: 'blue', hex: '#3b82f6' },
  { name: 'indigo', hex: '#6366f1' },
];

const fonts: { name: FontTheme; label: string; className: string }[] = [
  { name: 'inter', label: 'System Sans', className: 'font-sans' },
  { name: 'roboto', label: 'Roboto', className: 'font-roboto' },
  { name: 'lato', label: 'Lato', className: 'font-lato' },
  { name: 'montserrat', label: 'Montserrat', className: 'font-montserrat' },
  { name: 'source-sans', label: 'Source Sans', className: 'font-source-sans' },
  { name: 'lora', label: 'Lora (Serif)', className: 'font-lora' },
  { name: 'roboto-mono', label: 'Roboto Mono (Mono)', className: 'font-roboto-mono' },
];

const margins: { name: MarginTheme; label: string }[] = [
    { name: 'compact', label: 'Compact' },
    { name: 'normal', label: 'Normal' },
    { name: 'spacious', label: 'Spacious' },
];

const SliderControl: React.FC<{
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
}> = ({ label, value, onChange, min, max, step, unit }) => (
  <div>
    <div className="flex justify-between items-center mb-1.5">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <span className="text-xs font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
        {value.toFixed(step === 0.1 ? 1 : 0)}{unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={e => onChange(parseFloat(e.target.value))}
      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
    />
  </div>
);

const StylePreview: React.FC<{ customization: Customization }> = ({ customization }) => {
    const {
        color,
        font,
        nameSize,
        titleSize,
        sectionTitleSize,
        bodySize,
        lineHeight,
        sectionTitleColor,
        sectionTitleBorderStyle,
        sectionTitleBorderColor,
        sectionTitleUppercase,
    } = customization;

    const accentColor = colors.find(c => c.name === color)?.hex || '#f97316';
    const fontFamilyClass = fonts.find(f => f.name === font)?.className || 'font-sans';

    const sectionTitlePreviewStyles: React.CSSProperties = {
        fontSize: `${sectionTitleSize}pt`,
        color: sectionTitleColor,
        textTransform: sectionTitleUppercase ? 'uppercase' : 'none',
        paddingBottom: sectionTitleBorderStyle === 'underline' || sectionTitleBorderStyle === 'full' ? '0.1rem' : undefined,
        paddingTop: sectionTitleBorderStyle === 'overline' || sectionTitleBorderStyle === 'full' ? '0.1rem' : undefined,
        borderBottom: sectionTitleBorderStyle === 'underline' || sectionTitleBorderStyle === 'full' ? `2px solid ${sectionTitleBorderColor}` : 'none',
        borderTop: sectionTitleBorderStyle === 'overline' || sectionTitleBorderStyle === 'full' ? `2px solid ${sectionTitleBorderColor}` : 'none',
        display: 'inline-block'
    };
    
    return (
         <div className={`p-4 rounded-lg bg-slate-50 border border-slate-200 ${fontFamilyClass} text-slate-800`}>
            <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Live Preview</h4>
            <div style={{lineHeight}}>
                <h1 style={{ fontSize: `${nameSize}pt`, fontWeight: 'bold' }}>Your Name</h1>
                <h2 style={{ fontSize: `${titleSize}pt`, color: accentColor, fontWeight: '500' }}>Professional Title</h2>
                <div className="mt-3">
                    <h3 style={sectionTitlePreviewStyles}>Section Title</h3>
                    <p style={{ fontSize: `${bodySize}pt` }} className="mt-1 text-slate-600">
                        This is sample body text. It shows the selected font, size, and line height.
                    </p>
                </div>
            </div>
        </div>
    );
};


const CustomizationPanel: React.FC<CustomizationPanelProps> = ({ customization, setCustomization }) => {
  const handleUpdate = (key: keyof Customization, value: any) => {
    setCustomization({ ...customization, [key]: value });
  };
  
  return (
    <div className="space-y-5">
      <StylePreview customization={customization} />
      
      {/* Accent Color Selector */}
       <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Accent Color</label>
          <div className="flex items-center justify-between bg-white p-1.5 rounded-lg border border-slate-200 h-[42px]">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => handleUpdate('color', color.name)}
                className={`w-7 h-7 rounded-full transition-transform transform hover:scale-110 active:scale-100 focus:outline-none ${
                  customization.color === color.name ? 'ring-2 ring-offset-2 ring-offset-white ring-primary' : ''
                }`}
                style={{ backgroundColor: color.hex }}
                aria-label={`Select ${color.name} color`}
              />
            ))}
          </div>
        </div>

      {/* Font Selector */}
      <div>
        <label htmlFor="font-select" className="block text-sm font-medium text-slate-700 mb-2">Font Family</label>
        <select
          id="font-select"
          value={customization.font}
          onChange={(e) => handleUpdate('font', e.target.value as FontTheme)}
          className="block w-full text-sm pl-3 pr-8 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition bg-white text-slate-800"
        >
          {fonts.map(font => (
            <option key={font.name} value={font.name} className={font.className}>
              {font.label}
            </option>
          ))}
        </select>
      </div>
      
      {/* Typography Controls */}
      <div className="pt-4 border-t border-slate-200">
        <h4 className="text-sm font-medium text-slate-700 mb-3">Typography</h4>
        <div className="space-y-4">
          <SliderControl label="Name" value={customization.nameSize} onChange={v => handleUpdate('nameSize', v)} min={20} max={48} step={1} unit="pt" />
          <SliderControl label="Professional Title" value={customization.titleSize} onChange={v => handleUpdate('titleSize', v)} min={12} max={24} step={1} unit="pt" />
          <SliderControl label="Section Titles" value={customization.sectionTitleSize} onChange={v => handleUpdate('sectionTitleSize', v)} min={10} max={20} step={0.5} unit="pt" />
          <SliderControl label="Item Titles" value={customization.itemTitleSize} onChange={v => handleUpdate('itemTitleSize', v)} min={9} max={16} step={0.5} unit="pt" />
          <SliderControl label="Body Text" value={customization.bodySize} onChange={v => handleUpdate('bodySize', v)} min={8} max={14} step={0.5} unit="pt" />
          <SliderControl label="Line Height" value={customization.lineHeight} onChange={v => handleUpdate('lineHeight', v)} min={1.1} max={2.0} step={0.1} unit="x" />
        </div>
      </div>
      
       {/* Section Title Styling Controls */}
      <div className="pt-4 border-t border-slate-200">
        <h4 className="text-sm font-medium text-slate-700 mb-3">Section Title Styling</h4>
        <div className="space-y-4">
          <div className={`grid ${customization.sectionTitleBorderStyle !== 'none' ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
            <div>
              <label htmlFor="section-title-color" className="text-sm font-medium text-slate-700">Color</label>
              <input
                type="color"
                id="section-title-color"
                value={customization.sectionTitleColor}
                onChange={e => handleUpdate('sectionTitleColor', e.target.value)}
                className="w-full h-8 mt-1.5 p-1 bg-white border border-slate-300 rounded-md cursor-pointer"
              />
            </div>
            {customization.sectionTitleBorderStyle !== 'none' && (
              <div>
                <label htmlFor="section-border-color" className="text-sm font-medium text-slate-700">Border Color</label>
                <input
                  type="color"
                  id="section-border-color"
                  value={customization.sectionTitleBorderColor}
                  onChange={e => handleUpdate('sectionTitleBorderColor', e.target.value)}
                  className="w-full h-8 mt-1.5 p-1 bg-white border border-slate-300 rounded-md cursor-pointer"
                />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Border Style</label>
            <div className="flex rounded-lg border border-slate-300 bg-white p-1">
              {(['none', 'underline', 'overline', 'full'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => handleUpdate('sectionTitleBorderStyle', style)}
                  className={`w-full px-2 py-1.5 text-xs font-medium capitalize transition-colors transform active:scale-[0.98] rounded-md ${
                    customization.sectionTitleBorderStyle === style ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-700'
                  } focus:z-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-primary`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center pt-2">
            <label htmlFor="section-title-uppercase" className="text-sm font-medium text-slate-700">Force Uppercase</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="section-title-uppercase"
                checked={customization.sectionTitleUppercase}
                onChange={e => handleUpdate('sectionTitleUppercase', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Margin Control */}
       <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Margins</label>
        <div className="flex rounded-lg border border-slate-300 bg-white p-1">
          {margins.map((opt) => (
            <button
              key={opt.name}
              onClick={() => handleUpdate('margin', opt.name)}
              className={`w-full px-3 py-1.5 text-sm font-medium transition-colors transform active:scale-[0.98] rounded-md ${
                customization.margin === opt.name ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-700'
              }
              focus:z-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-primary`}
              title={opt.label}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default CustomizationPanel;