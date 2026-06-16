import { Injectable } from '@angular/core';
import * as qz from 'qz-tray';
import { TicketResponse, TicketLineItem } from '../../sales/data-access/store/sale.store'; // I will define these interfaces there or locally. Let's define them in sale-api.service.ts instead, since that's where the backend response comes. I'll import from there later.

export interface TicketResponse {
    saleId: number;
    timestamp: string;
    items: TicketLineItem[];
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    total: number;
}

export interface TicketLineItem {
    description: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class PrinterService {
  private connected = false;

  constructor() {
    this.connect();
  }

  private async connect(): Promise<void> {
    try {
      if (!qz.websocket.isActive()) {
        await qz.websocket.connect({ retries: 2, delay: 1 });
        this.connected = true;
      }
    } catch (e) {
      console.warn('QZ Tray connection failed:', e);
      this.connected = false;
    }
  }

  public async print(ticket: TicketResponse): Promise<void> {
    try {
      if (!qz.websocket.isActive()) {
        await this.connect();
      }

      if (!qz.websocket.isActive()) {
        throw new Error("QZ Tray daemon not running");
      }

      // We'll just use the default printer for silent printing
      const config = qz.configs.create(null); // null uses default printer
      const data = this.buildEscPos(ticket);
      
      await qz.print(config, data);
    } catch (e) {
      throw new Error("Error: check the printer connection");
    }
  }

  public buildEscPos(ticket: TicketResponse): any[] {
    const data = [];
    
    // Init command
    data.push('\\x1B\\x40'); 
    
    // Select CP850 codepage
    data.push('\\x1B\\x74\\x12');
    
    // Header
    data.push('TICKET\\n');
    data.push(`Sale ID: ${ticket.saleId}\\n`);
    data.push(`Date: ${ticket.timestamp}\\n`);
    data.push('------------------------------------------------\\n'); // 48 chars
    
    // Items
    if (ticket.items) {
      for (const item of ticket.items) {
        let leftCol = `${item.quantity}x ${item.description}`;
        if (leftCol.length > 38) {
          leftCol = leftCol.substring(0, 35) + '...';
        } else {
          leftCol = leftCol.padEnd(38, ' ');
        }
        
        let rightCol = Number(item.lineTotal).toFixed(2);
        rightCol = rightCol.padStart(10, ' ');
        
        data.push(leftCol + rightCol + '\\n');
      }
    }
    
    data.push('------------------------------------------------\\n');
    data.push(`Subtotal:    ${Number(ticket.subtotal).toFixed(2).padStart(35, ' ')}\\n`);
    data.push(`Tax Rate:    ${Number(ticket.taxRate).toFixed(2).padStart(35, ' ')}\\n`);
    data.push(`Tax Amount:  ${Number(ticket.taxAmount).toFixed(2).padStart(35, ' ')}\\n`);
    data.push(`TOTAL:       ${Number(ticket.total).toFixed(2).padStart(35, ' ')}\\n`);
    data.push('\\n\\n\\n');
    
    // Cash drawer kick
    data.push('\\x1B\\x70\\x00\\x19\\xFA');
    
    // Paper cut
    data.push('\\x1D\\x56\\x41\\x10');
    
    return data;
  }
}
