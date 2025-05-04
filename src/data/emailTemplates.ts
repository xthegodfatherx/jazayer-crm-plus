
export const welcomeEmailTemplate = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
  <div style="background-color: #7E69AB; padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Welcome to {{company_name}}!</h1>
  </div>
  
  <div style="padding: 20px;">
    <p>Hello {{user_name}},</p>
    
    <p>Welcome to {{company_name}}! We're thrilled to have you on board.</p>
    
    <p>Your account has been successfully created with the email address: <strong>{{user_email}}</strong></p>
    
    <p>With your new account, you can:</p>
    
    <ul style="padding-left: 20px;">
      <li>Manage your projects and tasks</li>
      <li>Collaborate with team members</li>
      <li>Track time and progress</li>
      <li>View and manage invoices</li>
    </ul>
    
    <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-left: 4px solid #7E69AB;">
      <p style="margin: 0;">To get started, please click on the button below to verify your email address and log in to your account:</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{login_url}}" style="background-color: #7E69AB; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Login to Your Account</a>
    </div>
    
    <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
    
    <p>Best regards,<br>The {{company_name}} Team</p>
  </div>
  
  <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
    <p>© 2023 {{company_name}}. All rights reserved.</p>
    <p>You received this email because you signed up for an account at {{company_name}}.</p>
  </div>
</div>
`;

export const passwordResetTemplate = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
  <div style="background-color: #FF6B6B; padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset</h1>
  </div>
  
  <div style="padding: 20px;">
    <p>Hello {{user_name}},</p>
    
    <p>We received a request to reset the password for your account with the email address: <strong>{{user_email}}</strong></p>
    
    <p>If you did not request this password reset, you can ignore this email and your password will remain unchanged.</p>
    
    <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-left: 4px solid #FF6B6B;">
      <p style="margin: 0;">To reset your password, please click on the button below:</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{reset_link}}" style="background-color: #FF6B6B; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Your Password</a>
    </div>
    
    <p>This password reset link will expire in 24 hours. If you need assistance, please contact our support team.</p>
    
    <p>Best regards,<br>The {{company_name}} Team</p>
  </div>
  
  <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
    <p>© 2023 {{company_name}}. All rights reserved.</p>
    <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
  </div>
</div>
`;

export const invoiceCreatedTemplate = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
  <div style="background-color: #4F46E5; padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">New Invoice Created</h1>
  </div>
  
  <div style="padding: 20px;">
    <p>Hello {{client_name}},</p>
    
    <p>We have created a new invoice for you.</p>
    
    <div style="border: 1px solid #ddd; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Invoice Number:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">{{invoice_number}}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Issue Date:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">{{invoice_date}}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Due Date:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">{{due_date}}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Amount Due:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #4F46E5;">{{amount}}</td>
        </tr>
      </table>
    </div>
    
    <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-left: 4px solid #4F46E5;">
      <p style="margin: 0;">To view the complete invoice and make a payment, please click the button below:</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{invoice_url}}" style="background-color: #4F46E5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">View Invoice</a>
    </div>
    
    <p>If you have any questions regarding this invoice, please don't hesitate to contact us.</p>
    
    <p>Thank you for your business!</p>
    
    <p>Best regards,<br>The {{company_name}} Team</p>
  </div>
  
  <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
    <p>© 2023 {{company_name}}. All rights reserved.</p>
    <p>This is an automated email from our billing system. Please do not reply to this email.</p>
  </div>
</div>
`;

export const taskAssignedTemplate = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
  <div style="background-color: #10B981; padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">New Task Assigned</h1>
  </div>
  
  <div style="padding: 20px;">
    <p>Hello {{assignee_name}},</p>
    
    <p>You have been assigned a new task by {{assigner_name}}.</p>
    
    <div style="border: 1px solid #ddd; padding: 15px; margin: 20px 0; border-radius: 4px; background-color: #f9fafb;">
      <h2 style="color: #10B981; margin-top: 0;">{{task_name}}</h2>
      
      <div style="margin: 15px 0;">
        <p style="color: #666; margin: 5px 0;">{{task_description}}</p>
      </div>
      
      <div style="display: flex; margin-top: 15px;">
        <div style="margin-right: 20px;">
          <strong>Priority:</strong>
          <span style="display: inline-block; padding: 3px 8px; background-color: #FEF3C7; color: #D97706; border-radius: 4px; margin-left: 5px;">Medium</span>
        </div>
        
        <div>
          <strong>Due Date:</strong>
          <span style="margin-left: 5px;">{{due_date}}</span>
        </div>
      </div>
    </div>
    
    <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-left: 4px solid #10B981;">
      <p style="margin: 0;">To view the complete task details and get started, please click the button below:</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{task_url}}" style="background-color: #10B981; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">View Task</a>
    </div>
    
    <p>If you have any questions about this task, please contact {{assigner_name}} or your team leader.</p>
    
    <p>Best regards,<br>The {{company_name}} Team</p>
  </div>
  
  <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
    <p>© 2023 {{company_name}}. All rights reserved.</p>
    <p>You received this email because you are a member of the project team.</p>
  </div>
</div>
`;

export const projectCreatedTemplate = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
  <div style="background-color: #6366F1; padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">New Project Created</h1>
  </div>
  
  <div style="padding: 20px;">
    <p>Hello {{user_name}},</p>
    
    <p>A new project has been created and you have been added as a team member.</p>
    
    <div style="border: 1px solid #ddd; padding: 15px; margin: 20px 0; border-radius: 4px; background-color: #f9fafb;">
      <h2 style="color: #6366F1; margin-top: 0;">{{project_name}}</h2>
      
      <div style="margin: 15px 0;">
        <p style="color: #666; margin: 5px 0;">{{project_description}}</p>
      </div>
      
      <div style="display: flex; flex-wrap: wrap; margin-top: 15px;">
        <div style="margin-right: 20px; margin-bottom: 10px;">
          <strong>Client:</strong>
          <span style="margin-left: 5px;">{{client_name}}</span>
        </div>
        
        <div style="margin-right: 20px; margin-bottom: 10px;">
          <strong>Start Date:</strong>
          <span style="margin-left: 5px;">{{start_date}}</span>
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong>End Date:</strong>
          <span style="margin-left: 5px;">{{end_date}}</span>
        </div>
      </div>
      
      <div>
        <strong>Project Manager:</strong>
        <span style="margin-left: 5px;">{{project_manager}}</span>
      </div>
    </div>
    
    <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-left: 4px solid #6366F1;">
      <p style="margin: 0;">To view the complete project details and get started, please click the button below:</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{project_url}}" style="background-color: #6366F1; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">View Project</a>
    </div>
    
    <p>If you have any questions about this project, please contact the project manager.</p>
    
    <p>Best regards,<br>The {{company_name}} Team</p>
  </div>
  
  <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
    <p>© 2023 {{company_name}}. All rights reserved.</p>
    <p>You received this email because you have been added to the project team.</p>
  </div>
</div>
`;
