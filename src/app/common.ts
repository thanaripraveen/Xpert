import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class common {
    userid: any;
    roleid: any;
    usertags: any;
    token: any = '';
    name: any;
    email: any;
    profileimage: any;
    roles: { admin: any, front: any } | any;
    profilestatus: any;

    constructor() {
        this.loadUserData();
    }

    saveUserData() {
        const userData = {
            userid: this.userid,
            roleid: this.roleid,
            usertags: this.usertags,
            token: this.token,
            name: this.name,
            email: this.email,
            profileimage: this.profileimage,
            roles: this.roles,
            profilestatus: this.profilestatus,
        };

        localStorage.setItem('userData', JSON.stringify(userData));
    }

    loadUserData() {
        const userData = localStorage.getItem('userData');
        if (userData) {
            const parsedData = JSON.parse(userData);
            this.userid = parsedData.userid;
            this.roleid = parsedData.roleid;
            this.usertags = parsedData.usertags;
            this.token = parsedData.token;
            this.name = parsedData.name;
            this.email = parsedData.email;
            this.profileimage = parsedData.profileimage;
            this.roles = parsedData.roles;
            this.profilestatus = parsedData.profilestatus;

        }
    }

    clearUserData() {
        localStorage.removeItem('userData');
        this.userid = null;
        this.roleid = null;
        this.usertags = null;
        this.token = '';
        this.name = null;
        this.email = null;
        this.profileimage = null;
        this.roles = { admin: null, front: null };
        this.profilestatus = null;

    }
}

export interface DealerOption {
    DealerName: string;
    DealerId: number;
}