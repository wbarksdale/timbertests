require 'sinatra'
require "sinatra/reloader"

set :public_folder, File.dirname(__FILE__) + '/'

# get '/timber/:filename' do
#    File.read(File.join('timber', "#{params[:filename]}"))
# end