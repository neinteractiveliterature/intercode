/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

import Popper from 'popper.js';
import Rails from 'rails-ujs';

import CadmusNavbarAdminApp from 'cadmus-navbar-admin';
import WebpackerReact from 'webpacker-react';

// import FormEditor from './FormEditor';
import FormPresenter from './FormPresenter';
import StaffPositionForm from './BuiltInForms/StaffPositionForm';
import TeamMemberForm from './BuiltInForms/TeamMemberForm';
import TicketPurchaseForm from './BuiltInForms/TicketPurchaseForm';
import TicketTypeForm from './BuiltInForms/TicketTypeForm';

WebpackerReact.setup({
  CadmusNavbarAdminApp,
//  FormEditor,
  FormPresenter,
  StaffPositionForm,
  TeamMemberForm,
  TicketPurchaseForm,
  TicketTypeForm,
});

Rails.start();
window.Popper = Popper;
