import { Injectable } from "@nestjs/common";

// Config
import { ConfigService } from "@nestjs/config";
 
// JWT Imports
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService) {

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            issuer: config.get<string>('AUTH0_ISSUER_URL'),
            audience: config.get<string>('AUTH0_AUDIENCE'),
            algorithms: ['RS256'],
            secretOrKeyProvider: jwksRsa.passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: `${config.get<string>('AUTH0_ISSUER_URL')}.well-known/jwks.json`,
            })
        })
    }

    validate(payload: any){
        return payload
    }
}