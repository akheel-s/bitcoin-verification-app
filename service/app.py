from flask import Flask, request, jsonify, make_response
from flask_restx import Api, Resource, fields
import joblib
import pickle
import numpy as np
from sklearn.model_selection import LeaveOneOut
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

import math
import numpy as np
from numpy import sqrt 
import pandas as pd
from sklearn.model_selection import LeaveOneOut
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score,f1_score

import matplotlib.pyplot as plt
import pandas as pd

from sklearn import metrics
from sklearn.metrics import accuracy_score, confusion_matrix, recall_score, precision_score, f1_score,roc_auc_score
import itertools
import string

flask_app = Flask(__name__)
app = Api(app = flask_app, 
		  version = "1.0", 
		  title = "Crypto transaction checker", 
		  description = "Verifying whether bitcoin transactio isnt phishing.")

name_space = app.namespace('prediction', description='Prediction APIs')

# model = app.model('Prediction params', 
# 				  {'textField1': fields.String(required = True, 
# 				  							   description="Text Field 1", 
#     					  				 	   help="Text Field 1 cannot be blank"),
# 				  'textField2': fields.String(required = True, 
# 				  							   description="Text Field 2", 
#     					  				 	   help="Text Field 2 cannot be blank"),
# 				  'select1': fields.Integer(required = True, 
# 				  							description="Select 1", 
#     					  				 	help="Select 1 cannot be blank"),
# 				  'select2': fields.Integer(required = True, 
# 				  							description="Select 2", 
#     					  				 	help="Select 2 cannot be blank"),
# 				  'select3': fields.Integer(required = True, 
# 				  							description="Select 3", 
#     					  				 	help="Select 3 cannot be blank")})

# classifier = joblib.load('classifier.joblib')

def string_vectorizer2(vector):
    lst = [0] * 62
    for i, vali in enumerate(vector):
	    for j, valj in enumerate(vali):
		    if(valj == 1):
			    lst[j] = 1

def string_vectorizer(strng, alphabet = string.ascii_lowercase+string.ascii_uppercase+string.digits):
    vector = [[0 if char != letter else 1 for char in alphabet] for letter in strng]

    vc = string_vectorizer2(vector)

    return vc

#bc1qlc4crdcfyp9tprh5wv0asznuqa8s8l80psfvf2
def filterAddress(df):
	df['address_data'] = df['address'].apply(string_vectorizer)
	cols=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9']

	df3 = pd.DataFrame(df['address_data'].to_list(), columns=cols)
	df2 = df.drop(['address_data'], axis = 1)

	df = pd.concat([df2, df3],axis = 1)
	df = df.drop(['address'], axis = 1)

	return df


def getDate(Date):
	Ls = []
	if len(Date) == 10:
		for i,val in enumerate(Date):
			if val != "/":
				Ls.append(int(val))

	else:
		str = "Date Invalid, Follow MM/DD/YYYY Format"
		print(str)

	return Ls


def filterDate(df):
	m_days = []

	List = getDate(df['date'][0])

	#MM
	List[0] *= 10
	List[1] *= 1

	#DD
	List[2] *= 10
	List[3] *= 1

	#YYYY
	List[4] *= 1000
	List[5] *= 100
	List[6] *= 10
	List[7] *= 1

	year = List[4] + List[5] + List[6] + List[7]

	is_leapyear = year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)

	if is_leapyear:
		m_days = [31,29,31,30,31,30,31,30,31,30,31,30]

	else:
		m_days = [31,28,31,30,31,30,31,30,31,30,31,30]

	Month = List[0] + List[1]

	Day = List[2] + List[3]

	for i,val in enumerate(m_days[:(Month-1)]):
		Day += val

	df['year'] = year #2011
	df['day'] = Day #8
	df = df.drop(['date'], axis = 1)


	return df

def BHC(input_address,input_date,input_amount):

	Pkl_Modelname = "RandomForestModel.pkl"

	#Loading Model
	with open(Pkl_Modelname, 'rb') as file:
		model = pickle.load(file)


	data = {"address": [input_address], 
		"date":[input_date],
		"bitcoin":[input_amount]}

	df = pd.DataFrame(data)

	df = filterDate(df)
	df = filterAddress(df)

	#print(df.info())


	output = model.predict(df)
	#output = linear_clf.predict(X)
	print(output)

	if output == 1:
		print('\033[1m' + '\Ransomware Detected' + '\033[0m')

	else:
		print('\033[1m' + '\nRansomeware Not Detected' + '\033[0m')
	return output

@name_space.route("/")
class MainClass(Resource):

	def options(self):
		response = make_response()
		response.headers.add("Access-Control-Allow-Origin", "*")
		response.headers.add('Access-Control-Allow-Headers', "*")
		response.headers.add('Access-Control-Allow-Methods', "*")
		return response

	@app.expect(BHC)	
	def post(self):
		try: 
			formData = request.json
			data = [val for val in formData.values()]
			# prediction = classifier.predict(data)
			response = jsonify({
				"statusCode": 200,
				"status": "Prediction made",
				"result": "Prediction: " + str(BHC(data))
				})
			response.headers.add('Access-Control-Allow-Origin', '*')
			return response
		except Exception as error:
			return jsonify({
				"statusCode": 500,
				"status": "Could not make prediction",
				"error": str(error)
			})