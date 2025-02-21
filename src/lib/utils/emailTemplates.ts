import DOMPurify from 'isomorphic-dompurify';

export interface Component {
  type: 'header' | 'text' | 'eventDetails' | 'button' | 'divider';
  content: string;
  style: 'primary' | 'secondary' | 'accent';
}

export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export interface TemplateData {
  fullName: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  guestCount?: number;
  managementLink?: string;
  [key: string]: any;
}

const sanitize = (content: string) => DOMPurify.sanitize(content);

const interpolateVariables = (content: string, data: TemplateData): string => {
  return content.replace(/\{([^}]+)\}/g, (match, key) => {
    return data[key] !== undefined ? String(data[key]) : match;
  });
};

const renderHeader = (content: string, style: string, theme: Theme): string => {
  const color = style === 'primary' ? theme.primaryColor : 
                style === 'secondary' ? theme.secondaryColor : theme.accentColor;
  
  return `
    <h1 style="color: ${color}; font-size: 24px; font-weight: bold; margin: 20px 0; text-align: center;">
      ${sanitize(content)}
    </h1>
  `;
};

const renderText = (content: string, style: string, theme: Theme): string => {
  const color = style === 'primary' ? theme.primaryColor : 
                style === 'secondary' ? theme.secondaryColor : theme.accentColor;
  
  return `
    <p style="color: ${color}; font-size: 16px; line-height: 1.5; margin: 16px 0;">
      ${sanitize(content)}
    </p>
  `;
};

const renderEventDetails = (data: TemplateData, style: string, theme: Theme): string => {
  const color = style === 'primary' ? theme.primaryColor : 
                style === 'secondary' ? theme.secondaryColor : theme.accentColor;
  
  return `
    <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <p style="color: ${color}; font-size: 16px; margin: 8px 0;">
        <strong>Date:</strong> ${sanitize(data.eventDate)}
      </p>
      <p style="color: ${color}; font-size: 16px; margin: 8px 0;">
        <strong>Time:</strong> ${sanitize(data.eventTime)}
      </p>
      <p style="color: ${color}; font-size: 16px; margin: 8px 0;">
        <strong>Venue:</strong> ${sanitize(data.venueName)}
      </p>
      <p style="color: ${color}; font-size: 16px; margin: 8px 0;">
        <strong>Address:</strong> ${sanitize(data.venueAddress)}
      </p>
      ${data.guestCount ? `
        <p style="color: ${color}; font-size: 16px; margin: 8px 0;">
          <strong>Guest Count:</strong> ${sanitize(String(data.guestCount))}
        </p>
      ` : ''}
    </div>
  `;
};

const renderButton = (content: string, style: string, theme: Theme): string => {
  const [text, link] = content.split('|');
  const backgroundColor = style === 'primary' ? theme.primaryColor : 
                         style === 'secondary' ? theme.secondaryColor : theme.accentColor;
  
  return `
    <div style="text-align: center; margin: 20px 0;">
      <a href="${sanitize(link)}" 
         style="background-color: ${backgroundColor}; 
                color: white; 
                padding: 12px 24px; 
                text-decoration: none; 
                border-radius: 4px; 
                display: inline-block;">
        ${sanitize(text)}
      </a>
    </div>
  `;
};

const renderDivider = (): string => {
  return `
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
  `;
};

const layouts = {
  default: (content: string, theme: Theme): string => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: system-ui, -apple-system, sans-serif; 
                   line-height: 1.5; 
                   margin: 0; 
                   padding: 0;">
        <div style="max-width: 600px; 
                    margin: 0 auto; 
                    padding: 20px;">
          ${content}
        </div>
      </body>
    </html>
  `,
  
  elegant: (content: string, theme: Theme): string => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Georgia, serif; 
                   line-height: 1.6; 
                   margin: 0; 
                   padding: 0; 
                   background-color: #fafafa;">
        <div style="max-width: 600px; 
                    margin: 40px auto; 
                    padding: 40px; 
                    background-color: white; 
                    border-radius: 8px; 
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          ${content}
        </div>
      </body>
    </html>
  `
};

export const renderEmailTemplate = (
  components: Component[], 
  layout: 'default' | 'elegant',
  theme: Theme,
  data: TemplateData
): string => {
  const renderedComponents = components.map(component => {
    const interpolatedContent = interpolateVariables(component.content, data);
    
    switch (component.type) {
      case 'header':
        return renderHeader(interpolatedContent, component.style, theme);
      case 'text':
        return renderText(interpolatedContent, component.style, theme);
      case 'eventDetails':
        return renderEventDetails(data, component.style, theme);
      case 'button':
        return renderButton(interpolatedContent, component.style, theme);
      case 'divider':
        return renderDivider();
      default:
        return '';
    }
  }).join('');

  return layouts[layout](renderedComponents, theme);
}; 