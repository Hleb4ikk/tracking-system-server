import { Module } from '@nestjs/common';
import { AppConfigModule } from './modules/configuration/appConfig.module';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { CompanyModule } from './modules/company/company.module';
import { InvitationModule } from './modules/invitation/invitation.module';
import { MembershipModule } from './modules/membership/membership.module';
import { VehicleModule } from './modules/vehicle/vehicle.module';
import { SupplyChainModule } from './modules/supply-chain/supply-chain.module';
import { SupplyNodeModule } from './modules/supply-node/supply-node.module';
import { RecieverModule } from './modules/reciever/reciever.module';
import { OrderModule } from './modules/order/order.module';
import { CargoModule } from './modules/cargo/cargo.module';

@Module({
  imports: [
    AppConfigModule,
    AuthModule,
    CompanyModule,
    InvitationModule,
    MembershipModule,
    VehicleModule,
    SupplyChainModule,
    SupplyNodeModule,
    RecieverModule,
    OrderModule,
    CargoModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
