import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { DeliveryType } from '../src/enums/DeliveryType';
import { ROLES } from '../src/enums/roles';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'tracking_system_db',
  user: process.env.DB_USERNAME || 'tracking_system_user',
  password: process.env.DB_PASSWORD || 'secretneyshiy_password',
});

async function seed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    console.log('🌱 Starting seed...');

    // Clean existing data (in reverse order of dependencies)
    console.log('🧹 Cleaning existing data...');
    await client.query('DELETE FROM cargos');
    await client.query('DELETE FROM status_history');
    await client.query('DELETE FROM orders');
    await client.query('DELETE FROM recievers');
    await client.query('DELETE FROM supply_node_connections');
    await client.query('DELETE FROM supply_chains');
    await client.query('DELETE FROM supply_nodes');
    await client.query('DELETE FROM vehicles');
    await client.query('DELETE FROM positions');
    await client.query('DELETE FROM invitations');
    await client.query('DELETE FROM companies');
    await client.query('DELETE FROM users');

    // Create users
    console.log('👥 Creating users...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    const usersResult = await client.query(
      `INSERT INTO users (email, username, name, surname, hashed_password, is_admin) VALUES 
        ('john.doe@example.com', 'johndoe', 'John', 'Doe', $1, false),
        ('jane.smith@example.com', 'janesmith', 'Jane', 'Smith', $1, false),
        ('mike.wilson@example.com', 'mikewilson', 'Mike', 'Wilson', $1, false),
        ('sarah.johnson@example.com', 'sarahjohnson', 'Sarah', 'Johnson', $1, false),
        ('alex.brown@example.com', 'alexbrown', 'Alex', 'Brown', $1, false),
        ('emma.davis@example.com', 'emmadavis', 'Emma', 'Davis', $1, false),
        ('admin@example.com', 'admin', 'Admin', 'User', $1, true),
        ('logistician1@example.com', 'logistician1', 'Tom', 'Anderson', $1, false),
        ('courier1@example.com', 'courier1', 'Bob', 'Martin', $1, false),
        ('expeditor1@example.com', 'expeditor1', 'Lisa', 'Taylor', $1, false),
        ('david.lee@example.com', 'davidlee', 'David', 'Lee', $1, false),
        ('maria.garcia@example.com', 'mariagarcia', 'Maria', 'Garcia', $1, false),
        ('chris.wang@example.com', 'chriswang', 'Chris', 'Wang', $1, false),
        ('anna.mueller@example.com', 'annamueller', 'Anna', 'Mueller', $1, false),
        ('pierre.dupont@example.com', 'pierredupont', 'Pierre', 'Dupont', $1, false)
      RETURNING id, email, username;`,
      [hashedPassword],
    );

    const users = usersResult.rows;
    console.log(`✅ Created ${users.length} users`);

    // Create companies
    console.log('🏢 Creating companies...');
    const companiesResult = await client.query(
      `INSERT INTO companies (title, description, owner_id) VALUES 
        ('Global Logistics Inc.', 'International shipping and logistics company with worldwide coverage', $1),
        ('FastTrack Delivery', 'Express delivery services across the country with same-day options', $2),
        ('Ocean Freight Co.', 'Maritime shipping and freight services for large cargo', $3),
        ('Air Express Logistics', 'Air cargo and express delivery for time-sensitive shipments', $4),
        ('EuroTrans GmbH', 'European transportation and logistics network', $5),
        ('Asia Pacific Trade', 'Asia-Pacific region import and export services', $6)
      RETURNING id, title;`,
      [
        users[0].id,
        users[1].id,
        users[2].id,
        users[3].id,
        users[4].id,
        users[5].id,
      ],
    );

    const companies = companiesResult.rows;
    console.log(`✅ Created ${companies.length} companies`);

    // Update users with company membership (positions)
    console.log('📝 Creating company memberships...');
    await client.query(
      `INSERT INTO positions (company_id, user_id, role) VALUES 
        ($1, $2, $3),
        ($4, $5, $6),
        ($7, $8, $9),
        ($10, $11, $12),
        ($13, $14, $15),
        ($16, $17, $18),
        ($19, $20, $21),
        ($22, $23, $24),
        ($25, $26, $27),
        ($28, $29, $30),
        ($31, $32, $33),
        ($34, $35, $36),
        ($37, $38, $39),
        ($40, $41, $42),
        ($43, $44, $45);`,
      [
        companies[0].id,
        users[0].id,
        ROLES.CO_FOUNDER,
        companies[0].id,
        users[6].id,
        ROLES.LOGISTICIAN,
        companies[0].id,
        users[7].id,
        ROLES.LOGISTICIAN,
        companies[0].id,
        users[8].id,
        ROLES.COURIER,
        companies[0].id,
        users[9].id,
        ROLES.EXPEDITOR,
        companies[1].id,
        users[1].id,
        ROLES.CO_FOUNDER,
        companies[1].id,
        users[10].id,
        ROLES.LOGISTICIAN,
        companies[1].id,
        users[11].id,
        ROLES.COURIER,
        companies[2].id,
        users[2].id,
        ROLES.CO_FOUNDER,
        companies[2].id,
        users[12].id,
        ROLES.LOGISTICIAN,
        companies[3].id,
        users[3].id,
        ROLES.CO_FOUNDER,
        companies[3].id,
        users[13].id,
        ROLES.LOGISTICIAN,
        companies[4].id,
        users[4].id,
        ROLES.CO_FOUNDER,
        companies[4].id,
        users[14].id,
        ROLES.LOGISTICIAN,
        companies[5].id,
        users[5].id,
        ROLES.CO_FOUNDER,
      ],
    );

    // Update users with company_id
    const userCompanyMappings = [
      {
        userId: users[0].id,
        companyId: companies[0].id,
        role: ROLES.CO_FOUNDER,
      },
      {
        userId: users[6].id,
        companyId: companies[0].id,
        role: ROLES.LOGISTICIAN,
      },
      {
        userId: users[7].id,
        companyId: companies[0].id,
        role: ROLES.LOGISTICIAN,
      },
      { userId: users[8].id, companyId: companies[0].id, role: ROLES.COURIER },
      {
        userId: users[9].id,
        companyId: companies[0].id,
        role: ROLES.EXPEDITOR,
      },
      {
        userId: users[1].id,
        companyId: companies[1].id,
        role: ROLES.CO_FOUNDER,
      },
      {
        userId: users[10].id,
        companyId: companies[1].id,
        role: ROLES.LOGISTICIAN,
      },
      { userId: users[11].id, companyId: companies[1].id, role: ROLES.COURIER },
      {
        userId: users[2].id,
        companyId: companies[2].id,
        role: ROLES.CO_FOUNDER,
      },
      {
        userId: users[12].id,
        companyId: companies[2].id,
        role: ROLES.LOGISTICIAN,
      },
      {
        userId: users[3].id,
        companyId: companies[3].id,
        role: ROLES.CO_FOUNDER,
      },
      {
        userId: users[13].id,
        companyId: companies[3].id,
        role: ROLES.LOGISTICIAN,
      },
      {
        userId: users[4].id,
        companyId: companies[4].id,
        role: ROLES.CO_FOUNDER,
      },
      {
        userId: users[14].id,
        companyId: companies[4].id,
        role: ROLES.LOGISTICIAN,
      },
      {
        userId: users[5].id,
        companyId: companies[5].id,
        role: ROLES.CO_FOUNDER,
      },
    ];

    console.log('✅ Created company memberships');

    // Create vehicles
    console.log('🚛 Creating vehicles...');
    const vehiclesResult = await client.query(
      `INSERT INTO vehicles (title, delivery_type, company_id) VALUES 
        ('Toyota Truck 001', $1, $4),
        ('Volvo Truck 002', $1, $4),
        ('Mercedes Truck 003', $1, $4),
        ('Ford Van 004', $1, $4),
        ('Renault Truck 005', $1, $5),
        ('MAN Truck 006', $1, $5),
        ('Scania Truck 007', $1, $5),
        ('DAF Truck 008', $1, $5),
        ('Iveco Truck 009', $1, $5),
        ('Electric Van 010', $1, $6),
        ('Hybrid Truck 011', $1, $6),
        ('Tesla Semi 012', $1, $6),
        ('Container Ship Alpha', $2, $6),
        ('Cargo Vessel Beta', $2, $6),
        ('Tanker Ship Gamma', $2, $6),
        ('Bulk Carrier Delta', $2, $6),
        ('Boeing 747 Freighter', $3, $7),
        ('Airbus A330 Cargo', $3, $7),
        ('Antonov An-124', $3, $7),
        ('Cessna Caravan', $3, $7),
        ('Ford Transit 021', $1, $7),
        ('Mercedes Sprinter 022', $1, $7),
        ('Volkswagen Crafter 023', $1, $7),
        ('Iveco Daily 024', $1, $7),
        ('Peugeot Boxer 025', $1, $8),
        ('Citroen Jumper 026', $1, $8),
        ('Renault Master 027', $1, $8),
        ('Opel Movano 028', $1, $8),
        ('MAZ Truck 029', $1, $9),
        ('KAMAZ Truck 030', $1, $9),
        ('Hyundai Truck 031', $1, $9),
        ('Isuzu Truck 032', $1, $9)
      RETURNING id, title;`,
      [
        DeliveryType.LAND,
        DeliveryType.WATER,
        DeliveryType.AIR,
        companies[0].id,
        companies[2].id,
        companies[3].id,
        companies[1].id,
        companies[4].id,
        companies[5].id,
      ],
    );

    const vehicles = vehiclesResult.rows;
    console.log(`✅ Created ${vehicles.length} vehicles`);

    // Create supply nodes
    console.log('📍 Creating supply nodes...');
    const supplyNodesResult = await client.query(
      `INSERT INTO supply_nodes (title, description, country, zip, region, city, address_line, company_id) VALUES 
        -- US Locations
        ('Main Warehouse NYC', 'Primary distribution center for East Coast', 'United States', '10001', 'New York', 'New York', '123 Broadway', $1),
        ('West Coast Hub', 'West coast distribution center', 'United States', '90210', 'California', 'Los Angeles', '456 Sunset Blvd', $1),
        ('Central Warehouse Chicago', 'Central US distribution hub', 'United States', '60601', 'Illinois', 'Chicago', '789 Michigan Ave', $1),
        ('Southern Depot Houston', 'Southern region warehouse', 'United States', '77001', 'Texas', 'Houston', '321 Main St', $1),
        ('Pacific Port SF', 'Main Pacific ocean port terminal', 'United States', '94102', 'California', 'San Francisco', '555 Pier St', $1),
        ('Atlantic Port Boston', 'Atlantic ocean terminal', 'United States', '02101', 'Massachusetts', 'Boston', '777 Harbor Way', $1),
        ('Miami Distribution Center', 'Southeast US hub and Caribbean gateway', 'United States', '33101', 'Florida', 'Miami', '888 Ocean Drive', $1),
        ('Seattle Port', 'Pacific Northwest shipping terminal', 'United States', '98101', 'Washington', 'Seattle', '100 Harbor Ave', $1),
        
        -- European Locations
        ('European Hub Berlin', 'European distribution center', 'Germany', '10115', 'Berlin', 'Berlin', '10 Alexanderplatz', $1),
        ('UK Warehouse London', 'United Kingdom distribution', 'United Kingdom', 'SW1A 1AA', 'London', 'London', '10 Downing St', $1),
        ('Paris Distribution Center', 'France logistics hub', 'France', '75001', 'Paris', 'Paris', '1 Rue de Paris', $1),
        ('Milan Warehouse', 'Italy distribution center', 'Italy', '20121', 'Lombardy', 'Milan', '1 Piazza del Duomo', $1),
        ('Madrid Logistics Hub', 'Spain distribution center', 'Spain', '28001', 'Madrid', 'Madrid', '1 Gran Via', $1),
        ('Amsterdam Port', 'Netherlands shipping terminal', 'Netherlands', '1012', 'North Holland', 'Amsterdam', '1 Damrak', $1),
        ('Rotterdam Terminal', 'Major European port', 'Netherlands', '3011', 'South Holland', 'Rotterdam', '1 Europoort', $1),
        
        -- Asian Locations
        ('Asian Hub Tokyo', 'Asian distribution center', 'Japan', '100-0001', 'Tokyo', 'Tokyo', '1-1 Chiyoda', $1),
        ('China Factory Beijing', 'Manufacturing facility', 'China', '100000', 'Beijing', 'Beijing', '88 Tiananmen', $1),
        ('Shanghai Port', 'Major Chinese port', 'China', '200001', 'Shanghai', 'Shanghai', '1 Bund Street', $1),
        ('Shenzhen Distribution', 'Southern China hub', 'China', '518000', 'Guangdong', 'Shenzhen', '1 Huaqiang Road', $1),
        ('Hong Kong Terminal', 'Special Administrative Region port', 'Hong Kong', '999077', 'Hong Kong', 'Hong Kong', '1 Victoria Harbour', $1),
        ('Singapore Port', 'Southeast Asia hub', 'Singapore', '018956', 'Singapore', 'Singapore', 'Port of Singapore', $1),
        ('Mumbai Distribution', 'India logistics center', 'India', '400001', 'Maharashtra', 'Mumbai', '1 Gateway of India', $1),
        ('Dubai Hub', 'Middle East distribution center', 'United Arab Emirates', '00000', 'Dubai', 'Dubai', 'Sheikh Zayed Road', $1),
        
        -- Other Global Locations
        ('Sydney Warehouse', 'Australia distribution center', 'Australia', '2000', 'New South Wales', 'Sydney', '1 Circular Quay', $1),
        ('Melbourne Distribution', 'Southern Australia hub', 'Australia', '3000', 'Victoria', 'Melbourne', '1 Flinders Street', $1),
        ('Sao Paulo Hub', 'South America distribution', 'Brazil', '01000-000', 'Sao Paulo', 'Sao Paulo', 'Av. Paulista 100', $1),
        ('Mexico City Depot', 'Mexico distribution center', 'Mexico', '06000', 'Mexico City', 'Mexico City', 'Paseo de la Reforma 1', $1),
        ('Toronto Warehouse', 'Canada distribution', 'Canada', 'M5V 3L9', 'Ontario', 'Toronto', '1 Front St W', $1),
        ('Vancouver Port', 'West Canada terminal', 'Canada', 'V6B 1A1', 'British Columbia', 'Vancouver', '1 Canada Place', $1),
        ('Johannesburg Hub', 'South Africa distribution', 'South Africa', '2001', 'Gauteng', 'Johannesburg', '1 Main Street', $1)
      RETURNING id, title;`,
      [companies[0].id],
    );

    const supplyNodes = supplyNodesResult.rows;
    console.log(`✅ Created ${supplyNodes.length} supply nodes`);

    // Create supply chains
    console.log('🔗 Creating supply chains...');
    const supplyChainsResult = await client.query(
      `INSERT INTO supply_chains (title, description, company_id) VALUES 
        ('US East Coast Route', 'Primary route for east coast deliveries from NYC to Miami', $1),
        ('US West Coast Route', 'Primary route for west coast deliveries from Seattle to LA', $1),
        ('Trans-Atlantic Route', 'Shipping route across Atlantic Ocean from US to Europe', $1),
        ('Trans-Pacific Route', 'Shipping route across Pacific Ocean from Asia to US', $1),
        ('European Distribution', 'European market distribution network', $1),
        ('Asian Supply Chain', 'Asian manufacturing to US distribution', $1),
        ('Global Express Route', 'Fast air cargo global route', $1),
        ('South America Route', 'South American market distribution', $1),
        ('Middle East Route', 'Middle East and Gulf region distribution', $1),
        ('Australia Route', 'Australia and Oceania distribution', $1),
        ('China Manufacturing Route', 'From Chinese factories to global markets', $1),
        ('Intra-Asia Route', 'Distribution network within Asia', $1)
      RETURNING id, title;`,
      [companies[0].id],
    );

    const supplyChains = supplyChainsResult.rows;
    console.log(`✅ Created ${supplyChains.length} supply chains`);

    // Create supply node connections
    console.log('🛤️ Creating supply node connections...');

    const connections: any[] = [];

    // US East Coast Route (0) - nodes 0, 2, 3, 6
    const conn1 = await client.query(
      `INSERT INTO supply_node_connections (supply_chain_id, start_node_id, destination_node_id, distance) VALUES 
        ($1, $2, $3, 450.5)
      RETURNING id`,
      [supplyChains[0].id, supplyNodes[0].id, supplyNodes[2].id],
    );
    connections.push(...conn1.rows);

    const conn2 = await client.query(
      `INSERT INTO supply_node_connections (supply_chain_id, start_node_id, destination_node_id, distance) VALUES 
        ($1, $2, $3, 1200.3)
      RETURNING id`,
      [supplyChains[0].id, supplyNodes[2].id, supplyNodes[3].id],
    );
    connections.push(...conn2.rows);

    const conn3 = await client.query(
      `INSERT INTO supply_node_connections (supply_chain_id, start_node_id, destination_node_id, distance) VALUES 
        ($1, $2, $3, 850.2)
      RETURNING id`,
      [supplyChains[0].id, supplyNodes[3].id, supplyNodes[6].id],
    );
    connections.push(...conn3.rows);

    const conn4 = await client.query(
      `INSERT INTO supply_node_connections (supply_chain_id, start_node_id, destination_node_id, distance) VALUES 
        ($1, $2, $3, 1100.0)
      RETURNING id`,
      [supplyChains[0].id, supplyNodes[6].id, supplyNodes[0].id],
    );
    connections.push(...conn4.rows);

    // US West Coast Route (1) - nodes 1, 4, 7
    const conn5 = await client.query(
      `INSERT INTO supply_node_connections (supply_chain_id, start_node_id, destination_node_id, distance) VALUES 
        ($1, $2, $3, 380.0)
      RETURNING id`,
      [supplyChains[1].id, supplyNodes[1].id, supplyNodes[4].id],
    );
    connections.push(...conn5.rows);

    const conn6 = await client.query(
      `INSERT INTO supply_node_connections (supply_chain_id, start_node_id, destination_node_id, distance) VALUES 
        ($1, $2, $3, 650.5)
      RETURNING id`,
      [supplyChains[1].id, supplyNodes[4].id, supplyNodes[7].id],
    );
    connections.push(...conn6.rows);

    const conn7 = await client.query(
      `INSERT INTO supply_node_connections (supply_chain_id, start_node_id, destination_node_id, distance) VALUES 
        ($1, $2, $3, 950.0)
      RETURNING id`,
      [supplyChains[1].id, supplyNodes[7].id, supplyNodes[1].id],
    );
    connections.push(...conn7.rows);

    // Trans-Atlantic Route (2) - nodes 5, 8, 9, 10
    const conn8 = await client.query(
      `INSERT INTO supply_node_connections (supply_chain_id, start_node_id, destination_node_id, distance) VALUES 
        ($1, $2, $3, 5500.0)
      RETURNING id`,
      [supplyChains[2].id, supplyNodes[5].id, supplyNodes[8].id],
    );
    connections.push(...conn8.rows);

    const conn9 = await client.query(
      `INSERT INTO supply_node_connections (supply_chain_id, start_node_id, destination_node_id, distance) VALUES 
        ($1, $2, $3, 930.0)
      RETURNING id`,
      [supplyChains[2].id, supplyNodes[8].id, supplyNodes[9].id],
    );
    connections.push(...conn9.rows);

    const conn10 = await client.query(
      `INSERT INTO supply_node_connections (supply_chain_id, start_node_id, destination_node_id, distance) VALUES 
        ($1, $2, $3, 340.0)
      RETURNING id`,
      [supplyChains[2].id, supplyNodes[9].id, supplyNodes[10].id],
    );
    connections.push(...conn10.rows);

    console.log(`✅ Created ${connections.length} supply node connections`);

    console.log(`✅ Created ${connections.length} supply node connections`);

    // Create receivers
    console.log('📦 Creating receivers...');
    const receiversResult = await client.query(
      `INSERT INTO recievers (name, surname, email, phone, company_id) VALUES 
        -- US Receivers
        ('Michael', 'Johnson', 'michael.johnson@example.com', '+1-555-0101', $1),
        ('Emily', 'Williams', 'emily.williams@example.com', '+1-555-0102', $1),
        ('Robert', 'Brown', 'robert.brown@example.com', '+1-555-0103', $1),
        ('Jennifer', 'Davis', 'jennifer.davis@example.com', '+1-555-0104', $1),
        ('William', 'Miller', 'william.miller@example.com', '+1-555-0105', $1),
        ('Jessica', 'Wilson', 'jessica.wilson@example.com', '+1-555-0106', $1),
        ('David', 'Moore', 'david.moore@example.com', '+1-555-0107', $1),
        ('Sarah', 'Taylor', 'sarah.taylor@example.com', '+1-555-0108', $1),
        
        -- European Receivers
        ('Hans', 'Schmidt', 'hans.schmidt@example.com', '+49-30-12345678', $1),
        ('Sophie', 'Dubois', 'sophie.dubois@example.com', '+33-1-23456789', $1),
        ('James', 'Smith', 'james.smith@example.com', '+44-20-12345678', $1),
        ('Isabella', 'Rossi', 'isabella.rossi@example.com', '+39-02-12345678', $1),
        ('Carlos', 'Rodriguez', 'carlos.rodriguez@example.com', '+34-91-1234567', $1),
        ('Anna', 'van der Berg', 'anna.vandenberg@example.com', '+31-20-1234567', $1),
        
        -- Asian Receivers
        ('Yuki', 'Tanaka', 'yuki.tanaka@example.com', '+81-3-12345678', $1),
        ('Wei', 'Chen', 'wei.chen@example.com', '+86-10-12345678', $1),
        ('Li', 'Wang', 'li.wang@example.com', '+86-21-12345678', $1),
        ('Raj', 'Patel', 'raj.patel@example.com', '+91-22-12345678', $1),
        ('Mohammed', 'Al-Rashid', 'mohammed.alrashid@example.com', '+971-4-1234567', $1),
        ('Mei', 'Lim', 'mei.lim@example.com', '+65-6123-4567', $1),
        
        -- Other Global Receivers
        ('Jack', 'Thompson', 'jack.thompson@example.com', '+61-2-1234-5678', $1),
        ('Olivia', 'Brown', 'olivia.brown@example.com', '+61-3-1234-5678', $1),
        ('Carlos', 'Silva', 'carlos.silva@example.com', '+55-11-1234-5678', $1),
        ('Maria', 'Lopez', 'maria.lopez@example.com', '+52-55-1234-5678', $1),
        ('John', 'MacDonald', 'john.macdonald@example.com', '+1-416-123-4567', $1),
        ('Emma', 'Chen', 'emma.chen@example.com', '+1-604-123-4567', $1),
        ('Thabo', 'Nkosi', 'thabo.nkosi@example.com', '+27-11-123-4567', $1),
        ('Fatima', 'Hassan', 'fatima.hassan@example.com', '+20-2-1234-5678', $1),
        ('Ahmed', 'Khan', 'ahmed.khan@example.com', '+92-21-1234-5678', $1),
        ('Nguyen', 'Tran', 'nguyen.tran@example.com', '+84-28-1234-5678', $1)
      RETURNING id, name, surname;`,
      [companies[0].id],
    );

    const receivers = receiversResult.rows;
    console.log(`✅ Created ${receivers.length} receivers`);

    // Create orders
    console.log('📋 Creating orders...');
    const ordersResult = await client.query(
      `INSERT INTO orders (title, status, description, responsible_id, reciever_id, company_id) VALUES 
        ('Electronics Shipment to NYC', 'in progress', 'Urgent delivery of electronic components from warehouse', $1, $2, $3),
        ('Furniture Delivery LA', 'pending', 'Office furniture delivery to new branch', $4, $5, $3),
        ('Medical Supplies Chicago', 'completed', 'Emergency medical supplies delivery', $6, $7, $3),
        ('Automotive Parts Houston', 'in progress', 'Car parts for repair shop', $8, $9, $3),
        ('Fashion Items Miami', 'pending', 'Spring collection delivery to retail store', $1, $10, $3),
        ('Tech Equipment Boston', 'in progress', 'Server equipment for data center', $4, $11, $3),
        ('Food Products Seattle', 'completed', 'Organic food products for supermarket chain', $6, $12, $3),
        ('Construction Materials SF', 'pending', 'Building materials for construction site', $8, $13, $3),
        ('Pharmaceutical Delivery Berlin', 'in progress', 'Temperature-controlled pharmaceutical products', $1, $14, $3),
        ('Luxury Goods Paris', 'completed', 'High-end fashion and accessories', $4, $15, $3),
        ('Books and Media London', 'pending', 'Educational materials for university', $6, $16, $3),
        ('Wine Shipment Milan', 'in progress', 'Premium wine collection for restaurant', $8, $17, $3),
        ('Art Supplies Madrid', 'pending', 'Professional art materials for gallery', $1, $18, $3),
        ('Electronics Amsterdam', 'completed', 'Consumer electronics for retail chain', $4, $19, $3),
        ('Machinery Tokyo', 'in progress', 'Industrial machinery parts', $6, $20, $3),
        ('Textiles Beijing', 'pending', 'Fabric and textile materials', $8, $21, $3),
        ('Consumer Goods Shanghai', 'in progress', 'Various consumer products for retail', $1, $22, $3),
        ('Spices Mumbai', 'completed', 'Exotic spices and ingredients', $4, $23, $3),
        ('Perfumes Dubai', 'pending', 'Luxury perfume collection', $6, $24, $3),
        ('Electronics Singapore', 'in progress', 'Latest tech gadgets and accessories', $8, $25, $3),
        ('Mining Equipment Sydney', 'pending', 'Heavy mining equipment parts', $1, $26, $3),
        ('Wine Melbourne', 'completed', 'Australian wine export', $4, $27, $3),
        ('Coffee Beans Sao Paulo', 'in progress', 'Premium coffee beans shipment', $6, $28, $3),
        ('Tequila Mexico City', 'pending', 'Premium tequila collection', $8, $29, $3),
        ('Maple Syrup Toronto', 'completed', 'Canadian maple syrup export', $1, $30, $3),
        ('Salmon Vancouver', 'in progress', 'Fresh salmon seafood delivery', $4, $31, $3),
        ('Diamonds Johannesburg', 'pending', 'Precious stones shipment', $6, $32, $3),
        ('Cotton Cairo', 'in progress', 'Egyptian cotton textiles', $8, $33, $3),
        ('Carpets Karachi', 'completed', 'Handmade carpet collection', $1, $34, $3),
        ('Rice Ho Chi Minh', 'pending', 'Premium rice export', $4, $35, $3)
      RETURNING id, title, status;`,
      [
        users[0].id,
        receivers[0].id,
        companies[0].id,
        users[7].id,
        receivers[1].id,
        users[7].id,
        receivers[2].id,
        users[9].id,
        receivers[3].id,
        receivers[4].id,
        receivers[5].id,
        receivers[6].id,
        receivers[7].id,
        receivers[8].id,
        receivers[9].id,
        receivers[10].id,
        receivers[11].id,
        receivers[12].id,
        receivers[13].id,
        receivers[14].id,
        receivers[15].id,
        receivers[16].id,
        receivers[17].id,
        receivers[18].id,
        receivers[19].id,
        receivers[20].id,
        receivers[21].id,
        receivers[22].id,
        receivers[23].id,
        receivers[24].id,
        receivers[25].id,
        receivers[26].id,
        receivers[27].id,
        receivers[28].id,
        receivers[29].id,
      ],
    );

    const orders = ordersResult.rows;
    console.log(`✅ Created ${orders.length} orders`);

    // Create cargos
    console.log('📦 Creating cargos...');
    const cargosResult = await client.query(
      `INSERT INTO cargos (title, status, description, order_id, vehicle_id, supply_node_connection_id, responsible_id, company_id) VALUES 
        ('Electronics Package 1', 'on the way', 'Laptops and tablets', $1, $2, $3, $4, $5),
        ('Electronics Package 2', 'assembly', 'Smartphones and accessories', $6, $7, $8, $9, $10),
        ('Office Desk Set', 'assembly', 'Executive office furniture', $11, $12, $13, $14, $15),
        ('Office Chairs', 'assembly', 'Ergonomic office chairs', $16, $17, $18, $19, $20),
        ('Medical Kit A', 'delivered', 'Emergency medical supplies', $21, $22, $23, $24, $25),
        ('Medical Kit B', 'delivered', 'Surgical instruments', $26, $27, $28, $29, $30),
        ('Engine Parts', 'on the way', 'Car engine components', $31, $32, $33, $34, $35),
        ('Brake Systems', 'assembly', 'Brake pads and discs', $36, $37, $38, $39, $40),
        ('Spring Dresses', 'assembly', 'Women fashion collection', $41, $42, $43, $44, $45),
        ('Spring Accessories', 'assembly', 'Bags and shoes', $46, $47, $48, $49, $50)
      RETURNING id, title, status;`,
      [
        // Cargo 1
        orders[0].id,
        vehicles[0].id,
        connections[0].id,
        users[0].id,
        companies[0].id,
        // Cargo 2
        orders[0].id,
        vehicles[1].id,
        connections[1].id,
        users[0].id,
        companies[0].id,
        // Cargo 3
        orders[1].id,
        vehicles[2].id,
        connections[2].id,
        users[7].id,
        companies[0].id,
        // Cargo 4
        orders[1].id,
        vehicles[3].id,
        connections[3].id,
        users[7].id,
        companies[0].id,
        // Cargo 5
        orders[2].id,
        vehicles[4].id,
        connections[4].id,
        users[7].id,
        companies[0].id,
        // Cargo 6
        orders[2].id,
        vehicles[5].id,
        connections[5].id,
        users[7].id,
        companies[0].id,
        // Cargo 7
        orders[3].id,
        vehicles[6].id,
        connections[6].id,
        users[9].id,
        companies[0].id,
        // Cargo 8
        orders[3].id,
        vehicles[7].id,
        connections[7].id,
        users[9].id,
        companies[0].id,
        // Cargo 9
        orders[4].id,
        vehicles[8].id,
        connections[8].id,
        users[0].id,
        companies[0].id,
        // Cargo 10
        orders[4].id,
        vehicles[9].id,
        connections[9].id,
        users[0].id,
        companies[0].id,
      ],
    );

    const cargos = cargosResult.rows;
    console.log(`✅ Created ${cargos.length} cargos`);

    await client.query('COMMIT');
    console.log('🎉 Seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Companies: ${companies.length}`);
    console.log(`   Vehicles: ${vehicles.length}`);
    console.log(`   Supply Nodes: ${supplyNodes.length}`);
    console.log(`   Supply Chains: ${supplyChains.length}`);
    console.log(`   Receivers: ${receivers.length}`);
    console.log(`   Orders: ${orders.length}`);
    console.log(`   Cargos: ${cargos.length}`);
    console.log('\n🔑 Test user credentials:');
    console.log('   Email: john.doe@example.com');
    console.log('   Password: password123');
    console.log('   Role: co-founder');
    console.log('   Company: Global Logistics Inc.');
    console.log('\n   Email: logistician1@example.com');
    console.log('   Password: password123');
    console.log('   Role: logistician');
    console.log('\n   Email: admin@example.com');
    console.log('   Password: password123');
    console.log('   Role: admin (no company)');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    client.release();
  }

  await pool.end();
}

seed().catch((error) => {
  console.error('Fatal error during seed:', error);
  process.exit(1);
});
