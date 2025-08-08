'''
from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Result, Document, Department
from .serializer import ResultSerializer, DocumentSerializer


class DocumentListAPIView(generics.ListAPIView):
    serializer_class = DocumentSerializer
    queryset = Document.objects.all()

    def get_queryset(self):
        queryset = self.queryset
        params = self.request.query_params

        session = params.get('session')
        semester = params.get('semester')
        course_code = params.get('course_code')

        if session:
            queryset = queryset.filter(session=session)
        if semester:
            queryset = queryset.filter(semester=semester)
        if course_code:
            queryset = queryset.filter(course_code=course_code)

        return queryset

from rest_framework.permissions import IsAuthenticated
from .permissions import IsHOD

class ApproveDocumentView(generics.UpdateAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated, IsHOD]
'''


from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Result, Document
from .serializer import ResultSerializer, DocumentSerializer



@api_view(['GET'])
def getresult(request):
    results = Result.objects.all()
    serializer = ResultSerializer(results, many=True)
    return Response(serializer.data)

'''
@api_view(['POST'])
def uploadresult(request):
    serializer = ResultSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()  # Creates a new Results record
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
'''


@api_view(['GET'])
def getdocument(request):
    documents = Document.objects.all()
    serializer = DocumentSerializer(documents, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def uploaddocument(request):
    serializer = DocumentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()  # Creates a new Document record
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

'''

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def uploadresult(request):
    data = request.data.copy()  # copy request data so we can modify it
    data['uploaded_by'] = request.user.id  # set uploaded_by to current user

    serializer = ResultSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
'''

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def uploadresult(request):
    serializer = ResultSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(uploaded_by=request.user)  # Auto set uploader
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)